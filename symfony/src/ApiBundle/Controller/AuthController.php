<?php

namespace ApiBundle\Controller;

use ApiBundle\Entity\User;
use ApiBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

/**
 * Class AuthController
 *
 * @Route("/auth")
 */
class AuthController extends BaseController
{

    /**
     * @Route("/signin")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     * @throws \Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException
     */
    public function signInAction(Request $request)
    {
        $user = $this->getDoctrine()->getRepository('ApiBundle:User')->findOneBy(['emailCanonical' => $request->getUser()]);

        if (!$user) {
            throw $this->createNotFoundException();
        }

        $isValid = $this->get('security.password_encoder')->isPasswordValid($user, $request->getPassword());

        if (!$isValid) {
            throw new BadCredentialsException();
        }

        $token = $this->get('lexik_jwt_authentication.encoder.default')->encode(
            [
                'fullname' => $user->getFullName(),
                'email' => $user->getEmailCanonical(),
                //'exp' => time() + 993600
                'exp' => time() + 3600 // 1 hour expiration
            ]
        );

        return new JsonResponse(
            [
                'token' => $token
            ]
        );
    }

    /**
     * @Route("/signup")
     * @Method("POST")
     * @param Request $request
     * @return Response|void
     */
    public function signUpAction(Request $request)
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
}