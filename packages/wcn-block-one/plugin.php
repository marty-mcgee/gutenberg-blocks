<?php
/**
 * Plugin Name: WCN Block One
 * Plugin URI: https://github.com/ahmadawais/create-guten-block/
 * Description: A Gutenberg blocks plugin created via create-guten-block.
 * Author: Marty McGee
 * Author URI: https://www.westcounty.com/
 * Version: 1.0.4
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';


/* [MM] PLUGIN NOTES

1) A latest post block, something that can take any post id, 
ideally with gutenberg autopopulate search to find the post/page/cpt. 
Once you select the post, you have some display options like card, list, promo. 
Then further being able to control whether it shows the title, excerpt, date, 
or other custom fields even would be super cool. This one is particularly 
useful for landing pages or "sidebars" in gutenberg.

2) A modal block, some way to add any set of blocks into a modal wrapper. 
Add a target from a button so probably anchor targets for global integration, 
and then be able to put any set of sub blocks into that modal. 
The trouble is how to put that into a post without it being clunky and 
confusing while editing. I've been sitting on this idea to try and think of 
how this would work. All in all, it might be best to not have it be a part of 
the page blocks, but maybe a seperate post type where you build modals and 
those can be selected in the post itself.

3) A read more block with a beginning and end target. So we can define exactly 
what falls in the read more.

4) A block that takes a post id and a key value to be able to call data from 
anywhere, basically using the get_post_meta function within the post content. 
This one is challenging to make easy on the UX. 
Just adding this in for you to think about.

*/
