<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\User;
use ApiBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UserController
 *
 * @Security("is_granted('ROLE_USER')")
 */
class UserController extends BaseController
{
    /**
     * @Route("/users")
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
     * @Route("/users/{email}", name="api_users_show")
     * @Method("GET")
     * @param $email
     * @return Response
     */
    public function showAction($email)
    {
        $user = $this->getDoctrine()
            ->getRepository(User::class)
            ->findOneBy(['emailCanonical' => $email]);

        if (!$user) {
            throw $this->createNotFoundException(
                sprintf(
                    'No user found with email "%s"',
                    $email
                )
            );
        }

        $response = $this->createApiResponse($user, 200);

        return $response;
    }

    /**
     * @Route("/users", name="api_users_collection")
     * @Method("GET")
     * @param Request $request
     * @return Response
     */
    public function listAction(Request $request)
    {
        $filter = $request->query->get('filter');

        $qb = $this->getDoctrine()
            ->getRepository(User::class)
            ->findAllQueryBuilder($filter);

        $paginatedCollection = $this->get('api.pagination_factory')
            ->createCollection($qb, $request, 'api_users_collection');

        $response = $this->createApiResponse($paginatedCollection, 200);

        return $response;
    }

    /**
     * @Route("/users/{email}")
     * @Method({"PUT", "PATCH", "POST"})
     * @param $email
     * @param Request $request
     * @return Response
     */
    public function updateAction($email, Request $request)
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
     * @Route("/users/{email}")
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
            // debated point: should we 404 on an unknown nickname?
            // or should we just return a nice 204 in all cases?
            // we're doing the latter
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();
        }

        return new Response(null, 204);
    }
}
