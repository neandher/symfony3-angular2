<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\User;
use ApiBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
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
     * @Method("GET")
     */
    public function listAction()
    {
        return $this->json(['0' => 'List Users!']);
    }

    /**
     * @Route("/users")
     * @Method("POST")
     */
    public function newAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        $this->processForm($request, $form);

        if (!$form->isValid()) {
            return $this->throwApiProblemValidationException($form);
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
                    'No user with email "%s"',
                    $email
                )
            );
        }

        $response = $this->createApiResponse($user, 200);

        return $response;
    }
}
