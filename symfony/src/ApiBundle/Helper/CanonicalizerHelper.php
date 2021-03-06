<?php

namespace ApiBundle\Helper;

class CanonicalizerHelper
{
    /**
     * @param $string
     * @return null|string
     */
    public function canonicalize($string)
    {
        return null === $string ? null : mb_convert_case($string, MB_CASE_LOWER, mb_detect_encoding($string));
    }
}