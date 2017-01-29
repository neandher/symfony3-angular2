<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        $data = [
            'name' => 'Neandher Carlos',
            'email' => 'neandher89@gmail.com'
        ];

        return $this->json($data);
    }

    /**
     * @param Request $request
     *
     * @Route("/login", name="default_login")
     * @Method("POST")
     */
    public function loginAction(Request $request)
    {
        $json = $request->get("json", null);

        if($json != null){
            $params = json_decode($json);

            $email = isset($params->email) ? $params->email : null;
            $password = isset($params->password) ? $params->password : null;

            var_dump($email);
            var_dump($password);
        }
        else{
            echo "send json with post!!!";
        }

        die();
    }
}
