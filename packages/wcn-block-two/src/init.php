<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package wcn
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

remove_filter ('the_content', 'wpautop');

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @since 1.0.0
 */
function wcn_block_assets() {
	// Styles.
	wp_enqueue_style( 'wcn-style-css', plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ) );

	wp_enqueue_style( 'font-awesome', plugins_url( 'lib/css/fontawesome.min.css', dirname( __FILE__ ) ) );
	wp_enqueue_style( 'bootstrap-style', plugins_url( 'lib/css/bootstrap.min.css', dirname( __FILE__ ) ) );

	// Scripts.
	wp_enqueue_script( 'bootstrap-script', plugins_url( 'lib/js/bootstrap.min.js', dirname( __FILE__ ) ), array('jquery') );

	// <!-- Required dependencies -->
	// wp_enqueue_script('prop-types-script', '//cdnjs.cloudflare.com/ajax/libs/prop-types/15.6.2/prop-types.min.js', array());
	// wp_enqueue_script('react-script', '//cdnjs.cloudflare.com/ajax/libs/react/16.7.0/umd/react.production.min.js', array());
	// wp_enqueue_script('react-dom-script', '//cdnjs.cloudflare.com/ajax/libs/react-dom/16.7.0/umd/react-dom.production.min.js', array());
	// wp_enqueue_script('reactstrap-script', '//cdnjs.cloudflare.com/ajax/libs/reactstrap/6.5.0/reactstrap.full.min.js', array());
    // <!-- Optional dependencies -->
	// wp_enqueue_script('react-transition-group-script', '//cdnjs.cloudflare.com/ajax/libs/react-transition-group/2.2.1/react-transition-group.min.js', array());
	// wp_enqueue_script('popper-script', '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js', array());
	// wp_enqueue_script('react-popper-script', '//cdnjs.cloudflare.com/ajax/libs/react-popper/0.10.4/umd/react-popper.min.js', array());
    // <!-- Lastly, include your app's bundle -->
	// <script type="text/javascript" src="/assets/bundle.js"></script>
} 
// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'wcn_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function wcn_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'wcn-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'wcn-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);
}
// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'wcn_editor_assets' );


// block.php
function wcn_block_two_render_block_query_builder( $attributes, $content ) {
	global $post;

	ob_start();
	
	// echo '<pre>';
	// var_dump($attributes);
	// echo '</pre>';
	// echo '<pre>';
	// var_dump($content);
	// echo '</pre>';

	// set attributes
	$att = [];
	$att['selectedPostTypes'] = isset($attributes["selectedPostTypes"]) ? $attributes['selectedPostTypes'] : [];
	$att['theTerms'] = isset($attributes["theTerms"]) ? $attributes['theTerms'] : [];

	$att['orderBy'] = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
	$att['order'] = isset($attributes['order']) ? $attributes['order'] : 'desc';
	$att['numToShow'] = isset($attributes['numToShow']) ? $attributes['numToShow'] : 12;
	$att['excludeIDs'] = isset($attributes['excludeIDs']) ? $attributes['excludeIDs'] : '';
	$att['excludeIDs'] = explode(',', $att['excludeIDs']);
	//var_dump($att['excludeIDs']);

	$att['layout'] = isset($attributes['layout']) ? $attributes['layout'] : '0';
	$att['hideTitle'] = isset($attributes['hideTitle']) ? $attributes['hideTitle'] : false;
	$att['hideDate'] = isset($attributes['hideDate']) ? $attributes['hideDate'] : false;
	$att['hideFeaturedMedia'] = isset($attributes['hideFeaturedMedia']) ? $attributes['hideFeaturedMedia'] : false;
	$att['hideExcerpt'] = isset($attributes['hideExcerpt']) ? $attributes['hideExcerpt'] : false;
	$att['excerptWordCount'] = isset($attributes['excerptWordCount']) ? $attributes['excerptWordCount'] : 30;
	$att['hideCTA'] = isset($attributes['hideCTA']) ? $attributes['hideCTA'] : false;
	$att['ctaContent'] = isset($attributes['ctaContent']) ? $attributes['ctaContent'] : 'Learn More';
	$att['columnsXS'] = isset($attributes['columnsXS']) ? $attributes['columnsXS'] : 12;
	$att['columnsSM'] = isset($attributes['columnsSM']) ? $attributes['columnsSM'] : 12;
	$att['columnsMD'] = isset($attributes['columnsMD']) ? $attributes['columnsMD'] : 6;
	$att['columnsLG'] = isset($attributes['columnsLG']) ? $attributes['columnsLG'] : 4;
	$att['columnsXL'] = isset($attributes['columnsXL']) ? $attributes['columnsXL'] : 4;

	// default and custom CSS class settings
	$att['customClassName'] = isset($attributes['className']) ? $attributes['className'] : '';
	$att['className'] = trim('wp-block-wcn-query-builder row ' . $att['customClassName']);

	// rename taxonomy keys to support wp_query
	$att['theTerms'] = change_key($att['theTerms'], 'categories', 'category');
	$att['theTerms'] = change_key($att['theTerms'], 'tags', 'tag');

	$args = array(
		'post_type' => $att['selectedPostTypes'],
		'post__not_in' => array(get_the_ID()),
		'post__not_in' => $att['excludeIDs'],
		'orderby' => $att['orderBy'],
		'order' => $att['order'],
		'posts_per_page' => $att['numToShow'],
	);

	$args['tax_query'] = [];
	$i = 0;
	foreach ($att['theTerms'] as $key => $val) {
		$args['tax_query'][$i]['taxonomy'] = $key;
		$args['tax_query'][$i]['field']    = 'id';
		$args['tax_query'][$i]['terms']    = $val;
		$args['tax_query'][$i]['operator'] = 'IN';
		$i++;
	}
	//var_dump($args);

	// Custom query.
	$query = new WP_Query( $args );
	//var_dump($query);

	// Check that we have query results.
	if ( $query->have_posts() ) {
	 
		echo '<div class="' . $att['className'] . ' wcn-post-type">';

			// Start looping over the query results.
			while ( $query->have_posts() ) {
		
				$query->the_post();
				//var_dump(get_the_ID());

				$att['featuredMediaArray'] = !$att['hideFeaturedMedia'] ? wp_get_attachment_image_src(get_post_thumbnail_id(get_the_ID()),"full") : [];
				//var_dump($att['featuredMediaArray']);
				$att['featuredMedia'] = $att['featuredMediaArray'][0];
		
				// DO ACTION HOOK AND RUN DEFAULT
				// Contents of the queried post results go here..
				add_action('output_one_result', 'wcn_block_two_render_block_query_builder_default_action', 10, 3);
				do_action('output_one_result', $att, $post, $att['layout']);

			}
	 
		echo '</div>';

	}
	 
	// Restore original post data.
	wp_reset_postdata();
	
	$output = ob_get_contents();
	ob_end_clean();

	return $output;
}
// register block save (return null) callback for php handling
register_block_type( 'wcn/query-builder', array(
    'render_callback' => 'wcn_block_two_render_block_query_builder',
) );

// default action
function wcn_block_two_render_block_query_builder_default_action($att, $post, $layout) {
	// var_dump($att);
	// var_dump($post);
	// var_dump($layout);
	setup_postdata($post);

	switch ($layout) {
		case '1' : {
	?>
		<div class="col-xs-<?php echo $att['columnsXS'] ?> col-sm-<?php echo $att['columnsSM'] ?> col-md-<?php echo $att['columnsMD'] ?> col-lg-<?php echo $att['columnsLG'] ?> col-xl-<?php echo $att['columnsXL'] ?>">
			<div class="card wcn-card-post-type">
				<div class="card-body">
					<?php if ( !$att['hideTitle'] ) : ?>
						<h4 class="card-title">
							<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
								<?php the_title() ?>
							</a>
						</h4>
					<?php endif; ?>
					<?php if ( !$att['hideDate'] ) : ?>
						<h5 class="card-subtitle">
							<?php echo date('F d, Y', strtotime(get_the_date())); ?>
						</h5>
					<?php endif; ?>
					<?php if ( !$att['hideExcerpt'] ) : ?>
						<p class="card-text">
							<?php echo wp_trim_words( get_the_excerpt(), $att['excerptWordCount'], '...' ); ?>
						</p>
					<?php endif; ?>
					<?php if ( !$att['hideCTA'] ) : ?>
						<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
							<button class="btn btn-secondary">
								<?php echo $att['ctaContent'] ?>
							</button>
						</a>
					<?php endif; ?>
				</div>
				<?php if ( !$att['hideFeaturedMedia'] && $att['featuredMedia'] != false ) : ?>
					<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
						<img width="100%" 
							src="<?php echo $att['featuredMedia'] ?>" 
							alt="Card Image Bottom for <?php the_title() ?>" 
							class="card-img-bottom" 
						/>
					</a>
				<?php endif; ?>
			</div>
		</div>
	<?php
			break;
		} 
		case '2' : {
	?>
		<div class="col-xs-<?php echo $att['columnsXS'] ?> col-sm-<?php echo $att['columnsSM'] ?> col-md-<?php echo $att['columnsMD'] ?> col-lg-<?php echo $att['columnsLG'] ?> col-xl-<?php echo $att['columnsXL'] ?>">
			<div class="card text-white wcn-card-post-type">
				<?php if ( !$att['hideFeaturedMedia'] && $att['featuredMedia'] != false ) : ?>
					
						<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
							<img width="100%" 
								src="<?php echo $att['featuredMedia'] ?>" 
								alt="Card Image Top for <?php the_title() ?>" 
								class="card-img" 
							/>
						</a>
					
				<?php endif; ?>
				<div class="card-img-overlay">
					<?php if ( !$att['hideTitle'] ) : ?>
						<h4 class="card-title">
							<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
								<?php the_title() ?>
							</a>
						</h4>
					<?php endif; ?>
					<?php if ( !$att['hideDate'] ) : ?>
						<h5 class="card-subtitle">
							<?php echo date('F d, Y', strtotime(get_the_date())); ?>
						</h5>
					<?php endif; ?>
					<?php if ( !$att['hideExcerpt'] ) : ?>
						<p class="card-text">
							<?php echo wp_trim_words( get_the_excerpt(), $att['excerptWordCount'], '...' ); ?>
						</p>
					<?php endif; ?>
					<?php if ( !$att['hideCTA'] ) : ?>
						<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
							<button class="btn btn-secondary">
								<?php echo $att['ctaContent'] ?>
							</button>
						</a>
					<?php endif; ?>
				</div>
			</div>
		</div>

	<?php
			break;
		} 
		default : {
	?>
		<div class="col-xs-<?php echo $att['columnsXS'] ?> col-sm-<?php echo $att['columnsSM'] ?> col-md-<?php echo $att['columnsMD'] ?> col-lg-<?php echo $att['columnsLG'] ?> col-xl-<?php echo $att['columnsXL'] ?>">
			<div class="card wcn-card-post-type">
				<?php if ( !$att['hideFeaturedMedia'] && $att['featuredMedia'] != false ) : ?>
					<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
						<img width="100%" 
							src="<?php echo $att['featuredMedia'] ?>" 
							alt="Card Image Top for <?php the_title() ?>" 
							class="card-img-top" 
						/>
					</a>
				<?php endif; ?>
				<div class="card-body">
					<?php if ( !$att['hideTitle'] ) : ?>
						<h4 class="card-title">
							<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
								<?php the_title() ?>
							</a>
						</h4>
					<?php endif; ?>
					<?php if ( !$att['hideDate'] ) : ?>
						<h5 class="card-subtitle">
							<?php echo date('F d, Y', strtotime(get_the_date())); ?>
						</h5>
					<?php endif; ?>
					<?php if ( !$att['hideExcerpt'] ) : ?>
						<p class="card-text">
							<?php echo wp_trim_words( get_the_excerpt(), $att['excerptWordCount'], '...' ); ?>
						</p>
					<?php endif; ?>
					<?php if ( !$att['hideCTA'] ) : ?>
						<a href="<?php the_permalink() ?>" title="<?php the_title() ?>">
							<button class="btn btn-secondary">
								<?php echo $att['ctaContent'] ?>
							</button>
						</a>
					<?php endif; ?>
				</div>
			</div>
		</div>

	<?php
			break;
		} // end cases
	} // end switch
	wp_reset_postdata();
}

function change_key( $array, $old_key, $new_key ) {

	if( ! array_key_exists( $old_key, $array ) )
		return $array;

	$keys = array_keys( $array );
	$keys[ array_search( $old_key, $keys ) ] = $new_key;

	return array_combine( $keys, $array );
}



// class all_terms
// {
//     public function __construct()
//     {
//         $version = '2';
//         $namespace = 'wp/v' . $version;
//         $base = 'all-terms';
//         register_rest_route($namespace, '/' . $base, array(
//             'methods' => 'GET',
//             'callback' => array($this, 'get_all_terms'),
//         ));
//     }

//     public function get_all_terms($object)
//     {
//         $return = array();
//         // $return['categories'] = get_terms('category');
// 		// $return['tags'] = get_terms('post_tag');
//         // Get taxonomies
//         $args = array(
//             'public' => true,
//             '_builtin' => false
//         );
//         $output = 'names'; // or objects
//         $operator = 'and'; // 'and' or 'or'
//         $taxonomies = get_taxonomies($args, $output, $operator);
//         foreach ($taxonomies as $key => $taxonomy_name) {
//             if ($taxonomy_name = $_GET['taxonomy']) {
//             	$return = get_terms($taxonomy_name);
//         	}
//         }
//         return new WP_REST_Response($return, 200);
//     }
// }
// add_action('rest_api_init', function () {
//     $all_terms = new all_terms;
// });