<?php

namespace ApiBundle\Repository;

/**
 * CommentRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class CommentRepository extends BaseRepository
{
    /**
     * @param array $params
     * @return \Doctrine\ORM\QueryBuilder
     */
    public function findAllQueryBuilder($params = [])
    {
        $qb = $this->createQueryBuilder('comment')
            ->addSelect('comment')
            ->innerJoin('comment.video', 'video')
            ->addSelect('video')
            ->innerJoin('comment.user', 'user')
            ->addSelect('user')
            ->leftJoin('comment.commentParent', 'commentParent')
            ->addSelect('commentParent');

        if (isset($params['filter']) && !empty($params['filter'])) {
            $qb->andWhere('video.title LIKE :filter')->setParameter('filter', '%' . $params['filter'] . '%');
        }

        if (isset($params['video']) && !empty($params['video'])) {
            $qb->andWhere('comment.video = :video')->setParameter('video', $params['video']);
        }

        if (isset($params['commentParent']) && !empty($params['commentParent'])) {
            $qb->andWhere('comment.commentParent = :commentParent')->setParameter('commentParent', $params['commentParent']);
        } else {
            $qb->andWhere('comment.commentParent is null');
        }

        if (!isset($params['sorting']) && empty($params['sorting'])) {
            $params['sorting'] = ['createdAt' => 'asc'];
        }

        $this->addOrderingQueryBuilder($qb, $params);

        return $qb;
    }
}
