<?php

namespace ApiBundle\VichUpload;

use ApiBundle\Entity\Video;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\NamerInterface;

class CustomVideoImageNamer implements NamerInterface
{
    /**
     * @param Video $object
     * @param PropertyMapping $mapping
     * @return mixed
     */
    public function name($object, PropertyMapping $mapping)
    {
        return 'maxresdefault.' . $mapping->getFile($object)->guessExtension();
    }

}