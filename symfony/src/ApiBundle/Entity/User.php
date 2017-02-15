<?php

namespace ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\Role\Role;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="ApiBundle\Repository\UserRepository")
 * @ORM\Table(name="user")
 * @Vich\Uploadable()
 * @UniqueEntity(
 *     "email",
 *     message="Email ja registrado!"
 * )
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation(
 *     "self",
 *     href = @Hateoas\Route(
 *          "api_users_show",
 *          parameters = { "email" = "expr(object.getEmailCanonical())" }
 *     )
 * )
 * @Hateoas\Relation(
 *     "channel_videos",
 *     href = @Hateoas\Route(
 *          "api_users_channel_videos",
 *          parameters = { "email" = "expr(object.getEmailCanonical())" }
 *     )
 * )
 */
class User implements AdvancedUserInterface
{
    /**
     * @var integer
     *
     * @Serializer\Expose()
     * @ORM\Id()
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @Serializer\Expose()
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     * @Assert\Length(min="2", max="255")
     */
    protected $firstName;

    /**
     * @var string
     *
     * @Serializer\Expose()
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     * @Assert\Length(min="2", max="255")
     */
    protected $lastName;

    /**
     * @var string
     *
     * @Serializer\Expose()
     * @ORM\Column(type="string", unique=true)
     * @Assert\NotBlank()
     * @Assert\Length(min="2", max="255")
     * @Assert\Email()
     */
    protected $email;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $emailCanonical;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $username;

    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="user_avatar", fileNameProperty="avatarImageName")
     *
     * @var File
     * @Assert\NotBlank(groups={"user_avatar_upload"})
     * @Assert\Image(
     *     groups={"user_avatar_upload"},
     *     mimeTypes = {"image/png", "image/jpg", "image/jpeg"}
     * )
     */
    protected $avatarImageFile;

    /**
     * @var string
     *
     * @Serializer\Expose()
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $avatarImageName;

    /**
     * @var bool
     *
     * @Serializer\Expose()
     * @ORM\Column(type="boolean")
     */
    protected $isEnabled = true;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $salt;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     */
    protected $password;

    /**
     * @Assert\NotBlank(groups={"creating", "resetting", "changing"})
     * @Assert\Length(min="2", max="255", groups={"creating", "resetting", "changing"})
     */
    protected $plainPassword;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $lastLoginAt;

    /**
     * @var bool
     *
     * @Serializer\Expose()
     * @ORM\Column(type="boolean")
     */
    protected $isLocked = false;

    /**
     * @var bool
     *
     * @Serializer\Expose()
     * @ORM\Column(type="boolean")
     */
    protected $isExpired = false;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $expiresAt;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $confirmationToken;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $passwordRequestedAt;

    /**
     * @var array
     *
     * @ORM\Column(type="array")
     */
    protected $roles = array();

    /**
     * @var bool
     *
     * @Serializer\Expose()
     * @ORM\Column(type="boolean")
     */
    protected $isCredentialsExpired = false;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $credentialsExpireAt;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    protected $createdAt;

    /**
     * @var \DateTime
     *
     * @Serializer\Expose()
     * @ORM\Column(type="datetime", nullable=true)
     * @Gedmo\Timestampable(on="update")
     */
    protected $updatedAt;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->salt = base_convert(sha1(uniqid(mt_rand(), true)), 16, 36);
    }

    /**
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    /**
     * @return string
     */
    public function getFullName()
    {
        return $this->getFirstName() . ' ' . $this->getLastName();
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getEmailCanonical()
    {
        return $this->emailCanonical;
    }

    /**
     * @param string $emailCanonical
     */
    public function setEmailCanonical($emailCanonical)
    {
        $this->emailCanonical = $emailCanonical;
    }

    /**
     * Get the truncated email
     *
     * The default implementation only keeps the part following @ in the address.
     *
     * @return string
     */
    public function getObfuscatedEmail()
    {
        $email = $this->getEmail();
        if (false !== $pos = strpos($email, '@')) {
            $email = '...' . substr($email, $pos);
        }

        return $email;
    }

    /**
     * Returns the username used to authenticate the user.
     *
     * @return string The username
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param string $username
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * This can return null if the password was not encoded using a salt.
     *
     * @return string|null The salt
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * @param string $salt
     * @return User
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsEnabled()
    {
        return $this->isEnabled;
    }

    /**
     * @param bool $isEnabled
     * @return User
     */
    public function setIsEnabled($isEnabled)
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * This should be the encoded password. On authentication, a plain-text
     * password will be salted, encoded, and then compared to this value.
     *
     * @return string The password
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param string $password
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * @param string $plainPassword
     * @return User
     */
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getLastLoginAt()
    {
        return $this->lastLoginAt;
    }

    /**
     * @param \DateTime $lastLoginAt
     * @return User
     */
    public function setLastLoginAt(\DateTime $lastLoginAt = null)
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    /**
     * Returns the roles granted to the user.
     *
     * <code>
     * public function getRoles()
     * {
     *     return array('ROLE_USER');
     * }
     * </code>
     *
     * Alternatively, the roles might be stored on a ``roles`` property,
     * and populated in any number of different ways when the user object
     * is created.
     *
     * @return Role[] The user roles
     */
    public function getRoles()
    {
        $roles = $this->roles;

        //foreach ($this->getGroups() as $group) {
        //    $roles = array_merge($roles, $group->getRoles());
        //}

        //$roles[] = static::ROLE_DEFAULT;

        if(!count($roles) > 0){
            $roles = ['ROLE_USER'];
        }

        return array_unique($roles);
    }

    /**
     * @param array $roles
     * @return User
     */
    public function setRoles(array $roles)
    {
        $this->roles = array();

        foreach ($roles as $role) {
            $this->addRole($role);
        }

        return $this;
    }

    /**
     * Adds a role to the user.
     *
     * @param string $role
     * @return User
     */
    public function addRole($role)
    {
        $role = strtoupper($role);
        //if ($role === static::ROLE_DEFAULT) {
        //    return $this;
        //}

        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsLocked()
    {
        return $this->isLocked;
    }

    /**
     * @param bool $isLocked
     * @return User
     */
    public function setIsLocked($isLocked)
    {
        $this->isLocked = $isLocked;

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsExpired()
    {
        return $this->isExpired;
    }

    /**
     * @param bool $isExpired
     * @return User
     */
    public function setIsExpired($isExpired)
    {
        $this->isExpired = $isExpired;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getExpiresAt()
    {
        return $this->expiresAt;
    }

    /**
     * @param \DateTime $expiresAt
     * @return User
     */
    public function setExpiresAt(\DateTime $expiresAt = null)
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getPasswordRequestedAt()
    {
        return $this->passwordRequestedAt;
    }

    /**
     * @param \DateTime $passwordRequestedAt
     * @return User
     */
    public function setPasswordRequestedAt(\DateTime $passwordRequestedAt = null)
    {
        $this->passwordRequestedAt = $passwordRequestedAt;

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsCredentialsExpired()
    {
        return $this->isCredentialsExpired;
    }

    /**
     * @param bool $isCredentialsExpired
     * @return User
     */
    public function setIsCredentialsExpired($isCredentialsExpired)
    {
        $this->isCredentialsExpired = $isCredentialsExpired;

        return $this;
    }

    /**
     * @return string
     */
    public function getConfirmationToken()
    {
        return $this->confirmationToken;
    }

    /**
     * @param string $confirmationToken
     * @return User
     */
    public function setConfirmationToken($confirmationToken)
    {
        $this->confirmationToken = $confirmationToken;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getCredentialsExpireAt()
    {
        return $this->credentialsExpireAt;
    }

    /**
     * @param \DateTime $credentialsExpireAt
     * @return User
     */
    public function setCredentialsExpireAt(\DateTime $credentialsExpireAt = null)
    {
        $this->credentialsExpireAt = $credentialsExpireAt;

        return $this;
    }

    /**
     * Checks whether the user's account has expired.
     *
     * Internally, if this method returns false, the authentication system
     * will throw an AccountExpiredException and prevent login.
     *
     * @return bool true if the user's account is non expired, false otherwise
     *
     * @see AccountExpiredException
     */
    public function isAccountNonExpired()
    {
        if (true === $this->isExpired) {
            return false;
        }

        if (null !== $this->expiresAt && $this->expiresAt->getTimestamp() < time()) {
            return false;
        }

        return true;
    }

    /**
     * Checks whether the user is locked.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a LockedException and prevent login.
     *
     * @return bool true if the user is not locked, false otherwise
     *
     * @see LockedException
     */
    public function isAccountNonLocked()
    {
        return !$this->isLocked;
    }

    /**
     * Checks whether the user's credentials (password) has expired.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a CredentialsExpiredException and prevent login.
     *
     * @return bool true if the user's credentials are non expired, false otherwise
     *
     * @see CredentialsExpiredException
     */
    public function isCredentialsNonExpired()
    {
        if (true === $this->isCredentialsExpired) {
            return false;
        }

        if (null !== $this->credentialsExpireAt && $this->credentialsExpireAt->getTimestamp() < time()) {
            return false;
        }

        return true;
    }

    /**
     * Checks whether the user is enabled.
     *
     * Internally, if this method returns false, the authentication system
     * will throw a DisabledException and prevent login.
     *
     * @return bool true if the user is enabled, false otherwise
     *
     * @see DisabledException
     */
    public function isEnabled()
    {
        return $this->isEnabled;
    }

    /**
     * Removes sensitive data from the user.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }

    /**
     * @param $ttl
     * @return bool
     */
    public function isPasswordRequestNonExpired($ttl)
    {
        return $this->getPasswordRequestedAt() instanceof \DateTime &&
        $this->getPasswordRequestedAt()->getTimestamp() + $ttl > time();
    }

    /**
     * @return File
     */
    public function getAvatarImageFile()
    {
        return $this->avatarImageFile;
    }

    /**
     * @param File $avatarImageFile
     * @return User
     */
    public function setAvatarImageFile(File $avatarImageFile = null)
    {
        $this->avatarImageFile = $avatarImageFile;

        if ($avatarImageFile instanceof UploadedFile) {
            $this->setUpdatedAt(new \DateTime());
        }

        return $this;
    }

    /**
     * @return File|null
     */
    public function getAvatarImageName()
    {
        return $this->avatarImageName;
    }

    /**
     * @param string $avatarImageName
     * @return User
     */
    public function setAvatarImageName($avatarImageName)
    {
        $this->avatarImageName = $avatarImageName;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     * @return User
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     * @return User
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}