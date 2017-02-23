<?php

namespace ApiBundle\FFmpeg;

use Psr\Log\LoggerInterface;

class FFmpeg
{
    /**
     * @var \FFMpeg\FFMpeg
     */
    public $ffmpeg;

    /**
     * @var
     */
    public $logger;

    /**
     * FFmpeg constructor.
     *
     * @param LoggerInterface $logger
     * @param array $ffmpegConfig
     */
    public function __construct(LoggerInterface $logger, Array $ffmpegConfig = [])
    {
        $this->logger = $logger;

        $this->ffmpeg = \FFMpeg\FFMpeg::create(
            [
                'ffmpeg.binaries' => str_replace(['\\', 'app/../'], ['/', ''], $ffmpegConfig['ffmpeg_binary']),
                'ffprobe.binaries' => str_replace(['\\', 'app/../'], ['/', ''], $ffmpegConfig['ffprobe_binary']),
                'timeout' => $ffmpegConfig['binary_timeout'],
                'ffmpeg.threads' => $ffmpegConfig['threads_count'],
            ]
            , $this->logger);
    }
}