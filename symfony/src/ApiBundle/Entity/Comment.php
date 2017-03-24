<?php

namespace ApiBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;
use Hateoas\Configuration\Annotation as Hateoas;
use JMS\Serializer\Annotation as Serializer;

/**
 * Comment
 *
 * @ORM\Table(name="comment")
 * @ORM\Entity(repositoryClass="ApiBundle\Repository\CommentRepository")
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation(
 *     "self",
 *     href = @Hateoas\Route(
 *          "api_comments_show",
 *          parameters = { "id" = "expr(object.getId())" }
 *     )
 * )
 *
 */
class Comment
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     * @Assert\NotBlank()
     * @Assert\Length(min="2")
     * @Serializer\Expose()
     */
    private $body;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     * @Gedmo\Timestampable(on="create")
     * @Serializer\Expose()
     */
    private $createdAt;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ApiBundle\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank()
     * @Serializer\Expose()
     */
    private $user;

    /**
     * @var Video
     *
     * @ORM\ManyToOne(targetEntity="ApiBundle\Entity\Video")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank()
     * @Serializer\Expose()
     */
    private $video;

    /**
     * @var Comment
     *
     * @ORM\ManyToOne(targetEntity="ApiBundle\Entity\Comment")
     * @ORM\JoinColumn(nullable=true)
     * @Serializer\Expose()
     */
    private $commentParent;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set body
     *
     * @param string $body
     *
     * @return Comment
     */
    public function setBody($body)
    {
        $this->body = $body;

        return $this;
    }

    /**
     * Get body
     *
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Comment
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return Comment
     */
    public function setUser($user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return Video
     */
    public function getVideo()
    {
        return $this->video;
    }

    /**
     * @param Video $video
     * @return Comment
     */
    public function setVideo($video)
    {
        $this->video = $video;
        return $this;
    }

    /**
     * @return Comment
     */
    public function getCommentParent()
    {
        return $this->commentParent;
    }

    /**
     * @param Comment $commentParent
     * @return Comment
     */
    public function setCommentParent($commentParent)
    {
        $this->commentParent = $commentParent;
        return $this;
    }
}

