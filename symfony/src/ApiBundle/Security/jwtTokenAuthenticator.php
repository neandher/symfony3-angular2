<?php

namespace ApiBundle\Security;

use ApiBundle\Api\ApiProblem;
use ApiBundle\Api\ResponseFactory;
use Doctrine\ORM\EntityManager;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

class jwtTokenAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var JWTEncoderInterface
     */
    private $jwtEncoder;

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var ResponseFactory
     */
    private $responseFactory;

    /**
     * jwtTokenAuthenticator constructor.
     * @param JWTEncoderInterface $jwtEncoder
     * @param EntityManager $em
     * @param ResponseFactory $responseFactory
     */
    public function __construct(JWTEncoderInterface $jwtEncoder, EntityManager $em, ResponseFactory $responseFactory)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->em = $em;
        $this->responseFactory = $responseFactory;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function getCredentials(Request $request)
    {
        $extractor = new AuthorizationHeaderTokenExtractor('Bearer', 'Authorization');

        $token = $extractor->extract($request);

        if (!$token) {
            return null;
        }

        return $token;
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return mixed
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        try {
            $data = $this->jwtEncoder->decode($credentials);
        } catch (JWTDecodeFailureException $e) {
            // if you want to, use can use $e->getReason() to find out which of the 3 possible things went wrong
            // and tweak the message accordingly
            // https://github.com/lexik/LexikJWTAuthenticationBundle/blob/05e15967f4dab94c8a75b275692d928a2fbf6d18/Exception/JWTDecodeFailureException.php

            throw new CustomUserMessageAuthenticationException($e->getReason());
        }

        $email = $data['email'];

        $user = $this->em->getRepository('ApiBundle:User')->findOneBy(['emailCanonical' => $email]);

        if (is_null($user)) {
            Throw new CustomUserMessageAuthenticationException('User not found!');
        }

        return $user;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return mixed
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return mixed
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $apiProblem = new ApiProblem(401);
        $apiProblem->set('detail', $exception->getMessageKey());

        return $this->responseFactory->createResponse($apiProblem);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return mixed
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // TODO: Implement onAuthenticationSuccess() method.
    }

    /**
     * @return mixed
     */
    public function supportsRememberMe()
    {
        return false;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return mixed
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $apiProblem = new ApiProblem(401);

        $message = $authException ? $authException->getMessageKey() : 'missing credentials';

        $apiProblem->set('detail', $message);

        return $this->responseFactory->createResponse($apiProblem);
    }
}