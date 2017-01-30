<?php

namespace ApiBundle\EventListener\Security;

use ApiBundle\Entity\User;
use ApiBundle\Helper\CanonicalizerHelper;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;

class CanonicalizerEmailSubscriber implements EventSubscriber
{

    /**
     * @var CanonicalizerHelper
     */
    private $canonicalizer;

    public function __construct(CanonicalizerHelper $canonicalizer)
    {
        $this->canonicalizer = $canonicalizer;
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

        $user->setEmailCanonical($this->canonicalizer->canonicalize($user->getEmail()));
    }

    public function preUpdate(LifecycleEventArgs $eventArgs)
    {
        /** @var User $user */
        $user = $eventArgs->getEntity();

        if (!$this->isUser($user)) {
            return;
        }

        $user->setEmailCanonical($this->canonicalizer->canonicalize($user->getEmail()));
    }
    
    private function isUser($entity)
    {
        return $entity instanceof User;
    }
}