<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\User;
use ApiBundle\Entity\Video;
use ApiBundle\Form\UserAvatarImageType;
use ApiBundle\Form\UserType;
use ApiBundle\Repository\VideoRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UserController
 *
 * @Security("is_granted('ROLE_USER')")
 * @Route("/users")
 */
class UserController extends BaseController
{
    /**
     * @Route("")
     * @Method("POST")
     * @param Request $request
     * @return Response|void
     */
    public function newAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        $this->processForm($request, $form);

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $response = $this->createApiResponse($user, 201);

        $userUrl = $this->generateUrl(
            'api_users_show',
            [
                'email' => $user->getEmailCanonical()
            ]
        );

        $response->headers->set('Location', $userUrl);

        return $response;
    }

    /**
     * @Route("/{email}", name="api_users_show")
     * @Method("GET")
     * @param $email
     * @return Response
     */
    public function showAction($email)
    {
        $user = $this->checkUser($email);
        $response = $this->createApiResponse($user, 200);

        return $response;
    }

    /**
     * @Route("", name="api_users_collection")
     * @Method("GET")
     * @param Request $request
     * @return Response
     */
    public function listAction(Request $request)
    {
        $params = $request->query->all();

        $qb = $this->getDoctrine()
            ->getRepository(User::class)
            ->findAllQueryBuilder($params);

        $paginatedCollection = $this->get('api.pagination_factory')
            ->createCollection($qb, $request, 'api_users_collection');

        $response = $this->createApiResponse($paginatedCollection, 200);

        return $response;
    }

    /**
     * @Route("/{email}")
     * @Method({"PUT", "PATCH"})
     * @param $email
     * @param Request $request
     * @return Response
     */
    public function updateAction($email, Request $request)
    {
        $user = $this->checkUser($email);
        $form = $this->createForm(UserType::class, $user);
        $this->processForm($request, $form);

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $response = $this->createApiResponse($user, 200);

        return $response;
    }

    /**
     * @Route("/{email}")
     * @Method("DELETE")
     * @param $email
     * @return Response
     */
    public function deleteAction($email)
    {
        $user = $this->getDoctrine()
            ->getRepository('ApiBundle:User')
            ->findOneBy(['emailCanonical' => $email]);

        if ($user) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();
        }

        return new Response(null, 204);
    }

    /**
     * @Route("/{email}/avatar")
     * @Method("POST")
     * @param Request $request
     * @param $email
     * @return Response
     */
    public function avatarImageUploadAction(Request $request, $email)
    {
        $user = $this->checkUser($email);

        $form = $this->createForm(UserAvatarImageType::class, $user);
        $form->submit($request->files->all());

        if (!$form->isValid()) {
            $this->throwApiProblemValidationException($form);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $response = $this->createApiResponse($user, 200);

        return $response;
    }

    /**
     * @Route("/{email}/channel-videos", name="api_users_channel_videos")
     * @Method("GET")
     * @param Request $request
     * @param $email
     * @return Response
     */
    public function channelVideos(Request $request, $email)
    {
        $user = $this->checkUser($email);

        $params = $request->query->all();

        $channelVideosQb = $this->getDoctrine()->getRepository(Video::class)->findAllQueryBuilder($params, $user);

        $collection = $this->get('api.pagination_factory')->createCollection(
            $channelVideosQb,
            $request,
            'api_users_channel_videos',
            ['email' => $user->getEmailCanonical()]
        );

        return $this->createApiResponse($collection);
    }

    /**
     * @param $email
     * @return User
     */
    private function checkUser($email)
    {
        $user = $this->getDoctrine()
            ->getRepository('ApiBundle:User')
            ->findOneBy(['emailCanonical' => $email]);

        if (!$user) {
            throw $this->createNotFoundException(
                sprintf(
                    'No user found with email "%s"',
                    $email
                )
            );
        }

        return $user;
    }
}