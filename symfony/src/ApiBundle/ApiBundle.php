<?php

namespace ApiBundle;

use ApiBundle\Helper\GlobalsHelper;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class ApiBundle extends Bundle
{
    public function boot()
    {
        $host = $this->container->getParameter('router.request_context.host');
        $scheme = $this->container->getParameter('router.request_context.scheme');

        $url = $scheme . '://' . $host;
        
        GlobalsHelper::setAvatarUrl(
            $url . '/' . $this->container->getParameter('upload_avatar_relative_path')
        );
        GlobalsHelper::setVideoUrl(
            $url . '/' . $this->container->getParameter('upload_video_relative_path')
        );
        GlobalsHelper::setVideoImageUrl(
            $url . '/' . $this->container->getParameter('upload_video_image_relative_path')
        );
    }

}
