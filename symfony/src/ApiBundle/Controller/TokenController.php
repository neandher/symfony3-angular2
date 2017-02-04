<?php

namespace ApiBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class TokenController extends BaseController
{

    /**
     * @Route("/tokens")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     * @throws \Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException
     */
    public function newTokenAction(Request $request)
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
}