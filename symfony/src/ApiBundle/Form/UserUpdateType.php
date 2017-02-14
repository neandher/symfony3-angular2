<?php

namespace ApiBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;

class UserUpdateType extends UserType
{

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults(array(
            'is_edit' => true,
            'validation_groups' => [],
        ));
    }

}
