<?php

namespace ApiBundle\Helper;

class GlobalsHelper
{
    /**
     * @var string
     */
    protected static $avatarUrl;

    /**
     * @var string
     */
    protected static $videoUrl;

    /**
     * @var string
     */
    protected static $videoImageUrl;

    public static function setAvatarUrl($dir)
    {
        self::$avatarUrl = $dir;
    }

    public static function getAvatarUrl()
    {
        return self::$avatarUrl;
    }

    /**
     * @return string
     */
    public static function getVideoImageUrl()
    {
        return self::$videoImageUrl;
    }

    /**
     * @param string $videoImageUrl
     */
    public static function setVideoImageUrl($videoImageUrl)
    {
        self::$videoImageUrl = $videoImageUrl;
    }

    /**
     * @return string
     */
    public static function getVideoUrl()
    {
        return self::$videoUrl;
    }

    /**
     * @param string $videoUrl
     */
    public static function setVideoUrl($videoUrl)
    {
        self::$videoUrl = $videoUrl;
    }
}