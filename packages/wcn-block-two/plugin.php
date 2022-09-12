<?php
/**
 * Plugin Name: WCN Block Two
 * Plugin URI: https://www.westcounty.com/
 * Description: A Gutenberg blocks plugin created by West County Net.
 * Author: Marty McGee, Julian Wilson Holmes
 * Author URI: https://www.westcounty.com/
 * Version: 0.4.7
 * License: GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 *
 * @package wcn
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';