<?php

namespace ApiBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

/**
 * BaseRepository
 */
class BaseRepository extends EntityRepository
{
    protected function addOrderingQueryBuilder(QueryBuilder $qb, $params = [])
    {
        $aliases = $qb->getRootAliases();

        if (isset($params['orderby']) && !empty($params['orderby'])
            && isset($params['sort']) && !empty($params['sort'])
        ) {
            $qb->orderBy($aliases[0] . '.' . $params['orderby'], $params['sort']);
        } else {
            $qb->orderBy($aliases[0] . '.id', 'DESC');
        }

        return $qb;
    }
}
