<?php

namespace ApiBundle\EventListener\Security;

use ApiBundle\Entity\User;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;

class EncodePasswordSubscriber implements EventSubscriber
{

    /**
     * @var UserPasswordEncoder
     */
    private $passwordEncoder;

    public function __construct(UserPasswordEncoder $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }


    /**
     * Returns an array of events this subscriber wants to listen to.
     *
     * @return array
     */
    public function getSubscribedEvents()
    {
        return array(
            'prePersist',
            'preUpdate'
        );
    }

    public function prePersist(LifecycleEventArgs $eventArgs)
    {
        /** @var User $user */
        $user = $eventArgs->getEntity();

        if (!$this->isUser($user)) {
            return;
        }

        $this->encodePassword($user);
    }

    public function preUpdate(PreUpdateEventArgs $eventArgs)
    {
        /** @var User $user */
        $user = $eventArgs->getEntity();

        if (!$this->isUser($user)) {
            return;
        }

        $this->encodePassword($user);
    }

    private function encodePassword(User $user)
    {
        $plainPassword = $user->getPlainPassword();
        
        if (!is_null($plainPassword)) {
            $user->setPassword($this->passwordEncoder->encodePassword($user, $plainPassword));
        }
    }

    private function isUser($entity)
    {
        return $entity instanceof User;
    }
}