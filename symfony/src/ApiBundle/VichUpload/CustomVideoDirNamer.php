<?php

namespace ApiBundle\VichUpload;

use ApiBundle\Entity\Video;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class CustomVideoDirNamer implements DirectoryNamerInterface
{
    /**
     * @param Video $object
     * @param PropertyMapping $mapping
     * @return mixed
     */
    public function directoryName($object, PropertyMapping $mapping)
    {
        return 'video_' . $object->getVideoNameNoExt();
    }

}