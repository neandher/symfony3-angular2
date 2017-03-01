<?php

namespace ApiBundle\Entity;

use ApiBundle\Helper\GlobalsHelper;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Video
 *
 * @ORM\Table(name="video")
 * @ORM\Entity(repositoryClass="ApiBundle\Repository\VideoRepository")
 * @Serializer\ExclusionPolicy("all")
 * @Vich\Uploadable()
 * @Hateoas\Relation(
 *     "self",
 *     href = @Hateoas\Route(
 *          "api_videos_show",
 *          parameters = { "id" = "expr(object.getId())" }
 *     )
 * )
 */
class Video
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
     * @ORM\Column(name="title", type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(min="2", max="255")
     * @Serializer\Expose()
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     * @Serializer\Expose()
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(min="2", max="20")
     * @Serializer\Expose()
     */
    private $status;

    /**
     * @Vich\UploadableField(mapping="video_image", fileNameProperty="imageName")
     *
     * @var File
     * @Assert\NotBlank(groups={"image_upload"})
     * @Assert\File(
     *     groups={"image_upload"},
     *     mimeTypes = {"image/png", "image/jpg", "image/jpeg"}
     * )
     */
    private $imageFile;

    /**
     * @var string
     *
     * @ORM\Column(name="image_name", type="string", length=255, nullable=true)
     * @Serializer\Expose()
     */
    private $imageName;

    /**
     * @var int
     *
     * @ORM\Column(name="miniature_number", type="smallint", nullable=true)
     * @Serializer\Expose()
     */
    private $miniatureNumber;

    /**
     * @Vich\UploadableField(mapping="video", fileNameProperty="videoName")
     *
     * @var File
     * @Assert\NotBlank(groups={"video_upload"})
     * @Assert\File(
     *     groups={"video_upload"},
     *     mimeTypes = {"video/mp4"}
     * )
     */
    private $videoFile;

    /**
     * @var string
     *
     * @ORM\Column(name="video_name", type="string", length=255, nullable=true)
     * @Serializer\Expose()
     */
    private $videoName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     * @Gedmo\Timestampable(on="create")
     * @Serializer\Expose()
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     * @Gedmo\Timestampable(on="update")
     * @Serializer\Expose()
     */
    private $updatedAt;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="ApiBundle\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     * @Serializer\Expose()
     * @Serializer\Groups({"deep"})
     */
    private $user;

    /**
     * Video constructor.
     */
    public function __construct()
    {
        $this->miniatureNumber = 1;
    }


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
     * Set title
     *
     * @param string $title
     *
     * @return Video
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Video
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return Video
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param File $imageFile
     * @return Video
     */
    public function setImageFile(File $imageFile = null)
    {
        $this->imageFile = $imageFile;

        if ($imageFile instanceof UploadedFile) {
            $this->setUpdatedAt(new \DateTime());
        }

        return $this;
    }

    /**
     * Set image
     *
     * @param string $imageName
     *
     * @return Video
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * Get image
     *
     * @return string
     */
    public function getImageName()
    {
        return $this->imageName;
    }

    /**
     * @return string|null
     *
     * @Serializer\VirtualProperty()
     * @Serializer\SerializedName("imageUrl")
     */
    public function getImageUrl()
    {
        return $this->imageName ? GlobalsHelper::getVideoImageUrl() . '/' . $this->imageName : null;
    }

    /**
     * @return File
     */
    public function getVideoFile()
    {
        return $this->videoFile;
    }

    /**
     * @param File $videoFile
     * @return Video
     */
    public function setVideoFile(File $videoFile = null)
    {
        $this->videoFile = $videoFile;

        if ($videoFile instanceof UploadedFile) {
            $this->setUpdatedAt(new \DateTime());
        }

        return $this;
    }

    /**
     * Set videoName
     *
     * @param string $videoName
     *
     * @return Video
     */
    public function setVideoName($videoName)
    {
        $this->videoName = $videoName;

        return $this;
    }

    /**
     * Get videoName
     *
     * @return string
     */
    public function getVideoName()
    {
        return $this->videoName;
    }

    /**
     * Get videoNameNoExt
     *
     * @return string
     */
    public function getVideoNameNoExt()
    {
        return $this->videoName ? explode('.', $this->videoName)[0] : null;
    }

    /**
     * @return string|null
     *
     * @Serializer\VirtualProperty()
     * @Serializer\SerializedName("videoUrl")
     */
    public function getVideoUrl()
    {
        return $this->videoName ? GlobalsHelper::getVideoUrl() . '/video_' . $this->getVideoNameNoExt() . '/' . $this->videoName : null;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Video
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
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Video
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
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
     * @return Video
     */
    public function setUser($user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return int
     */
    public function getMiniatureNumber()
    {
        return $this->miniatureNumber;
    }

    /**
     * @param int $miniatureNumber
     * @return Video
     */
    public function setMiniatureNumber($miniatureNumber)
    {
        $this->miniatureNumber = $miniatureNumber;
        return $this;
    }

    /**
     * @return string
     *
     * @Serializer\VirtualProperty()
     * @Serializer\SerializedName("imagesUrl")
     */
    public function getImagesUrl()
    {
        $videoNameNoExt = $this->getVideoNameNoExt();

        if (!$this->imageName && $this->videoName) {
            $data = [
                'default' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default' . $this->miniatureNumber . '.jpg',
                'mqdefault' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'mqdefault' . $this->miniatureNumber . '.jpg',
                'maxresdefault' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'maxresdefault' . $this->miniatureNumber . '.jpg',
            ];
        } else if ($this->imageName && $this->videoName) {
            $data = [
                'default' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default' . '.jpg',
                'mqdefault' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'mqdefault' . '.jpg',
                'maxresdefault' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'maxresdefault' . '.jpg',
            ];
        } else {
            $data = [
                'default' => null,
                'mqdefault' => null,
                'maxresdefault' => null,
            ];
        }

        return $data;
    }

    /**
     * @return string
     *
     * @Serializer\VirtualProperty()
     * @Serializer\SerializedName("imagesThumbsUrl")
     */
    public function getImagesThumbsUrl()
    {
        $videoNameNoExt = $this->getVideoNameNoExt();

        if ($this->videoName) {

            $thumbs[] = ['1' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default1' . '.jpg'];
            $thumbs[] = ['2' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default2' . '.jpg'];
            $thumbs[] = ['3' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default3' . '.jpg'];

            if ($this->imageName) {
                $thumbs[] = ['4' => GlobalsHelper::getVideoImageUrl() . '/video_' . $videoNameNoExt . '/' . 'default' . '.jpg'];
            }
        } else {
            $thumbs = null;
        }

        return $thumbs;
    }
}