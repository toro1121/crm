<?

class ApiTest extends TestCase {

    public function testApi() {
        $this->get('/api')
            ->seeJson([
                'bool' => true,
            ]);
    }

    public function testUserLogin() {
        $this->post('api/user/login', [
            'username' => 'demo@demo.com',
            'password' => 'demo@demo.com',
        ])
            ->seeJson([
                'bool' => true,
            ]);
    }

    public function testUserLogout() {
        $this->get('api/user/logout')
            ->seeJson([
                'bool' => false,
            ]);
    }

    public function testClientList() {
        $this->withoutMiddleware();
        $this->get('/api/client')
            ->seeJson([
                'bool' => true,
            ]);
    }

    public function testCompanyList() {
        $this->withoutMiddleware();
        $this->get('/api/company')
            ->seeJson([
                'bool' => true,
            ]);
    }

}
