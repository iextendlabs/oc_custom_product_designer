<?php
class ControllerExtensionModuleCustomDesignCart extends Controller {
	private $error = array();
	
	public function install() {

		$ifcolumn=$this->db->query("SHOW COLUMNS FROM `".DB_PREFIX."cart` LIKE 'custom'");
		if(!$ifcolumn->num_rows) {
			$this->db->query("ALTER TABLE `".DB_PREFIX."cart` ADD `custom` text NOT NULL AFTER `option`");
		}

		$this->db->query("CREATE TABLE IF NOT EXISTS `".DB_PREFIX."product_to_customimage` (
			`product_id` int(11) NOT NULL,
  			`image` text NOT NULL
		)");

		$this->db->query("CREATE TABLE IF NOT EXISTS `".DB_PREFIX."order_custom` (
			`order_custom_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			`order_id` int(11) NOT NULL,
			`order_product_id` int(11) NOT NULL,
			`name` varchar(255) NOT NULL,
			`value` text NOT NULL
		)");

		$this->db->query("CREATE TABLE IF NOT EXISTS `".DB_PREFIX."product_custom_fields` (
			`product_custom_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			`product_id` int(11) NOT NULL,
			`label` varchar(255) NOT NULL,
			`position_x` varchar(255) NOT NULL,
			`position_y` varchar(255) NOT NULL,
			`max_length` varchar(255) NOT NULL,
			`default_text` varchar(255) NOT NULL,
			`color` varchar(255) NOT NULL,
			`family` varchar(255) NOT NULL,
			`size` varchar(255) NOT NULL,
			`opacity` varchar(255) NOT NULL DEFAULT '1',
			`required` tinyint(1) NOT NULL DEFAULT '0',
			`height` varchar(255) NOT NULL,
			`width` varchar(255) NOT NULL
		)");
		
	}

	public function index() {
		$this->install();
		$this->load->language('extension/module/customdesigncart');

		$this->document->setTitle($this->language->get('heading_title'));

		$this->load->model('setting/setting');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
			$this->model_setting_setting->editSetting('module_customdesigncart', $this->request->post);

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
		}

		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('extension/module/customdesigncart', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['action'] = $this->url->link('extension/module/customdesigncart', 'user_token=' . $this->session->data['user_token'], true);

		$data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

		if (isset($this->request->post['module_customdesigncart_status'])) {
			$data['module_customdesigncart_status'] = $this->request->post['module_customdesigncart_status'];
		} else {
			$data['module_customdesigncart_status'] = $this->config->get('module_customdesigncart_status');
		}

		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/customdesigncart', $data));
	}

	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/customdesigncart')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		return !$this->error;
	}
}
