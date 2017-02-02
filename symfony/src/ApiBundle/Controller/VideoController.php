<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\Video;
use ApiBundle\Form\VideoFileType;
use ApiBundle\Form\VideoImageType;
use ApiBundle\Form\VideoType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class VideoController
 *
 * @Security("is_granted('ROLE_USER')")
 * @Route("/videos")
 */
class VideoController extends BaseController
{
    /**
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
     * @Route("/{id}", requirements={"id": "\d+"})
     * @Method({"PUT", "PATCH"})
     * @param $id
     * @param Request $request
     * @return Response
     */
    public function updateAction(Request $request, $id)
    {
        $video = $this->checkVideo($id);
        
        $form = $this->createForm(VideoType::class, $video);
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
     * @Route("/{id}/image", requirements={"id": "\d+"})
     * @Method("POST")
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function imageUploadAction(Request $request, $id)
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

        $response = $this->createApiResponse($video, 200);

        return $response;
    }

    /**
     * @Route("/{id}/video", requirements={"id": "\d+"})
     * @Method("POST")
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function videoUploadAction(Request $request, $id)
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