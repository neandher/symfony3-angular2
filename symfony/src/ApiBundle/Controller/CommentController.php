<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\Comment;
use ApiBundle\Entity\Video;
use ApiBundle\Form\CommentType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CommentController
 *
 * @Route("/comments")
 */
class CommentController extends BaseController
{
    /**
     * @Route("/{video}/video", requirements={"video": "\d+"})
     * @ParamConverter("video", class="ApiBundle:Video")
     * @Method("POST")
     * @Security("is_granted('ROLE_USER')")
     *
     * @param Request $request
     * @param Video $video
     * @return Response|void
     */
    public function newAction(Request $request, Video $video)
    {
        $comment = new Comment();
        $comment->setVideo($video);
        $comment->setUser($this->getUser());

        $form = $this->createForm(CommentType::class, $comment);

        $this->processForm($request, $form);

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($comment);
        $em->flush();

        $response = $this->createApiResponse($comment, 201);

        $commentUrl = $this->generateUrl(
            'api_comments_show',
            [
                'id' => $comment->getId()
            ]
        );

        $response->headers->set('Location', $commentUrl);

        return $response;
    }

    /**
     * @Route("/{id}", requirements={"id": "\d+"}, name="api_comments_show")
     * @Method("GET")
     * @param Comment $comment
     * @return Response
     * @internal param Request $request
     */
    public function showAction(Comment $comment)
    {
        $response = $this->createApiResponse($comment, 200);

        return $response;
    }

    /**
     * @Route("", name="api_comments_collection")
     * @Route("/{video}/video", requirements={"video": "\d+"}, name="api_comments_video_collection")
     * @ParamConverter("video", class="ApiBundle:Video")
     * @Method("GET")
     * @param Request $request
     * @param Video $video
     * @return Response
     */
    public function listAction(Request $request, $video = null)
    {
        $params = $request->query->all();

        $qb = $this->getDoctrine()
            ->getRepository(Comment::class)
            ->findAllQueryBuilder($params, $video);

        $paginatedCollection = $this->get('api.pagination_factory')
            ->createCollection($qb, $request, 'api_comments_collection');

        $response = $this->createApiResponse($paginatedCollection, 200);

        return $response;
    }

    /**
     * @Route("/{id}", requirements={"id": "\d+"})
     * @Method("DELETE")
     * @Security("is_granted('ROLE_USER')")
     *
     * @param Comment $comment
     * @return Response
     */
    public function deleteAction(Comment $comment)
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($comment);
        $em->flush();

        return new Response(null, 204);
    }
}