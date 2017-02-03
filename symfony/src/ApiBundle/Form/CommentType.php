<?php

namespace ApiBundle\Form;

use ApiBundle\Entity\User;
use ApiBundle\Entity\Video;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CommentType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('body', TextType::class)
            ->add('videoId', EntityType::class,
                [
                    'class' => Video::class,
                    'property_path' => 'video'
                ])
            ->add('userId', EntityType::class,
                [
                    'class' => User::class,
                    'property_path' => 'user'
                ]);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'ApiBundle\Entity\Comment',
            'csrf_protection' => false
        ));
    }
}
