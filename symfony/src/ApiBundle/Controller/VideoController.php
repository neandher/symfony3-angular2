<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\Video;
use ApiBundle\Form\VideoFileType;
use ApiBundle\Form\VideoImageType;
use ApiBundle\Form\VideoType;
use FFMpeg\Coordinate\TimeCode;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class VideoController
 *
 * @Route("/videos")
 */
class VideoController extends BaseController
{
    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("")
     * @Method("POST")
     * @param Request $request
     * @return Response|void
     */
    public function newAction(Request $request)
    {
        $video = new Video();
        $form = $this->createForm(VideoType::class, $video);

        $this->processForm($request, $form);

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($video);
        $em->flush();

        $response = $this->createApiResponse($video, 201);

        $videoUrl = $this->generateUrl(
            'api_videos_show',
            [
                'id' => $video->getId()
            ]
        );

        $response->headers->set('Location', $videoUrl);

        return $response;
    }

    /**
     * @Route("/{id}", requirements={"id": "\d+"}, name="api_videos_show")
     * @Method("GET")
     * @param $id
     * @return Response
     */
    public function showAction($id)
    {
        $video = $this->checkVideo($id);
        $response = $this->createApiResponse($video, 200);

        return $response;
    }

    /**
     * @Route("", name="api_videos_collection")
     * @Method("GET")
     * @param Request $request
     * @return Response
     */
    public function listAction(Request $request)
    {
        $params = $request->query->all();

        $qb = $this->getDoctrine()
            ->getRepository(Video::class)
            ->findAllQueryBuilder($params);

        $paginatedCollection = $this->get('api.pagination_factory')
            ->createCollection($qb, $request, 'api_videos_collection');

        $response = $this->createApiResponse($paginatedCollection, 200);

        return $response;
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/{id}", requirements={"id": "\d+"})
     * @Method({"PUT", "PATCH"})
     * @param $id
     * @param Request $request
     * @return Response
     */
    public function updateAction(Request $request, $id)
    {
        $video = $this->checkVideo($id);

        $form = $this->createForm(VideoType::class, $video, ['is_edit' => true]);
        $this->processForm($request, $form);

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($video);
        $em->flush();

        $response = $this->createApiResponse($video, 200);

        return $response;
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/{id}", requirements={"id": "\d+"})
     * @Method("DELETE")
     * @param $id
     * @return Response
     */
    public function deleteAction($id)
    {
        $video = $this->getDoctrine()
            ->getRepository('ApiBundle:Video')
            ->findOneBy(['id' => $id]);

        if ($video) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($video);
            $em->flush();
        }

        return new Response(null, 204);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/{id}/upload", requirements={"id": "\d+"})
     * @Method("POST")
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function uploadAction(Request $request, $id)
    {
        $video = $this->checkVideo($id);

        $form = $this->createForm(VideoFileType::class, $video);
        $form->submit($request->files->all());

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($video);
        $em->flush();

        /*$response = $this->createApiResponse($video, 200);

        return $response;*/

        return $this->generateThumbsVideo($request, $video);
    }

    /**
     * @param Request $request
     * @param Video $video
     * @return Response
     */
    private function generateThumbsVideo(Request $request, Video $video)
    {
        $videoNameNoExt = $video->getVideoNameNoExt();

        $videoPath = str_replace(
                ['\\', 'app/../'],
                ['/', ''],
                $this->getParameter('upload_video_path')
            ) . '/video_' . $videoNameNoExt;

        $imageVideoPath = str_replace(
                ['\\', 'app/../'],
                ['/', ''],
                $this->getParameter('upload_video_image_path')
            ) . '/video_' . $videoNameNoExt;

        $imageVideoRelativePath = $this->getParameter('upload_video_image_relative_path') . '/video_' . $videoNameNoExt;

        $ffmpeg = $this->get('api.ffmpeg')->ffmpeg;

        $openVideo = $ffmpeg->open($videoPath . '/' . $video->getVideoName());

        if (is_null($video->getImageName())) {

            if (!is_dir($imageVideoPath)) {
                mkdir($imageVideoPath);
            }

            $openVideo
                ->frame(TimeCode::fromSeconds(20))
                ->save($imageVideoPath . '/' . 'maxresdefault1.jpg');

            $openVideo
                ->frame(TimeCode::fromSeconds(30))
                ->save($imageVideoPath . '/' . 'maxresdefault2.jpg');

            $openVideo
                ->frame(TimeCode::fromSeconds(40))
                ->save($imageVideoPath . '/' . 'maxresdefault3.jpg');

            for ($i = 1; $i < 4; $i++) {
                $this->generateThumb(
                    $request,
                    'thumb_120_90',
                    $imageVideoRelativePath,
                    'maxresdefault' . $i . '.jpg',
                    'default' . $i . '.jpg'
                );
                $this->generateThumb(
                    $request,
                    'thumb_320_180',
                    $imageVideoRelativePath,
                    'maxresdefault' . $i . '.jpg',
                    'mqdefault' . $i . '.jpg'
                );
            }
        } else if ($video->getImageName()) {
            $this->generateThumb(
                $request,
                'thumb_120_90',
                $imageVideoRelativePath,
                'maxresdefault' . '.jpg',
                'default' . '.jpg'
            );
            $this->generateThumb(
                $request,
                'thumb_320_180',
                $imageVideoRelativePath,
                'maxresdefault' . '.jpg',
                'mqdefault' . '.jpg'
            );
        }

        $response = $this->createApiResponse($video, 200);

        return $response;
    }

    private function generateThumb($request, $filter, $path, $fileName, $newFileName)
    {
        $imageManagerResponse = $this->container->get('liip_imagine.controller');

        $imageManagerResponse->filterAction($request, $path . '/' . $fileName, $filter);

        $fileTemp = new File(
            $this->getParameter('upload_cache_path') . '/' . $filter . '/' . $path . '/' . $fileName
        );
        
        $fileTemp->move($path, $newFileName);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/{id}/upload-image", requirements={"id": "\d+"})
     * @Method("POST")
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function uploadImageAction(Request $request, $id)
    {
        $video = $this->checkVideo($id);

        $form = $this->createForm(VideoImageType::class, $video);
        $form->submit($request->files->all());

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($video);
        $em->flush();

        $this->generateThumbsVideo($request, $video);

        $response = $this->createApiResponse($video, 200);

        return $response;
    }

    /**
     * @param $id
     * @return Video
     */
    private function checkVideo($id)
    {
        $video = $this->getDoctrine()
            ->getRepository('ApiBundle:Video')
            ->findOneBy(['id' => $id]);

        if (!$video) {
            throw $this->createNotFoundException(
                sprintf(
                    'No video found with id "%s"',
                    $id
                )
            );
        }

        return $video;
    }
}