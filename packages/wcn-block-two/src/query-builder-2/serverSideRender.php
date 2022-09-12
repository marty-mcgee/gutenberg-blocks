<?php
// block.php
function wcn_block_two_render_block_query_builder( $attributes, $content ) {
    global $post;

	// set attributes
	$att = [];
	$att['postTypesArray'] = isset($attributes["selectedPostTypes"]) ? $attributes['selectedPostTypes'] : [];
	$att['postTypesList'] = isset($attributes["selectedPostTypes"]) ? $attributes['selectedPostTypes'] : '';
	$att['categoriesList'] = isset($attributes["selectedCategories"]) ? implode(', ', $attributes['selectedCategories']) : '';
	$att['tagsList'] = isset($attributes["selectedTags"]) ? implode(', ', $attributes['selectedTags']) : '';

	$att['orderBy'] = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'post_date';
	$att['order'] = isset($attributes['order']) ? $attributes['order'] : 'desc';
	$att['numToShow'] = isset($attributes['numToShow']) ? $attributes['numToShow'] : 12;
	$att['excludeIDs'] = isset($attributes['excludeIDs']) ? $attributes['excludeIDs'] : '';
	$att['excludeIDs'] = explode(',', $att['excludeIDs']);
	//var_dump($att['excludeIDs']);

	$att['hideTitle'] = isset($attributes['hideTitle']) ? $attributes['hideTitle'] : false;
	$att['hideDate'] = isset($attributes['hideDate']) ? $attributes['hideDate'] : false;
	$att['hideFeaturedMedia'] = isset($attributes['hideFeaturedMedia']) ? $attributes['hideFeaturedMedia'] : false;
	$att['hideExcerpt'] = isset($attributes['hideExcerpt']) ? $attributes['hideExcerpt'] : false;
	$att['excerptWordCount'] = isset($attributes['excerptWordCount']) ? $attributes['excerptWordCount'] : 30;
	$att['hideCTA'] = isset($attributes['hideCTA']) ? $attributes['hideCTA'] : false;
	$att['ctaContent'] = isset($attributes['ctaContent']) ? $attributes['ctaContent'] : 'Call-To-Action';
	$att['columnsToShow'] = isset($attributes['columnsToShow']) ? $attributes['columnsToShow'] : 4;

	// default and custom CSS class settings
	$att['customClassName'] = isset($attributes['className']) ? $attributes['className'] : '';
	$att['className'] = trim('wp-block-wcn-query-builder row ' . $att['customClassName']);

	$args = array(
		'post_type' => $att['postTypesArray'],
		'post__not_in' => array(get_the_ID()),
		'post__not_in' => $att['excludeIDs'],
		'orderby' => $att['orderBy'],
		'order' => $att['order'],
		'posts_per_page' => $att['numToShow'],
	);
	if ($att['categoriesList'] !== '' && $att['postTypesList'] === 'post') { // in_array("post", $att['postTypesArray'])
		$args['cat'] = $att['categoriesList'];
	}
	if ($att['tagsList'] !== '' && $att['postTypesList'] === 'post') { // in_array("post", $att['postTypesArray'])
		$args['tag'] = $att['tagsList'];
	}

	// Custom query.
	$query = new WP_Query( $args );

	ob_start();

	// Check that we have query results.
	if ( $query->have_posts() ) {
	 
		echo '<div class="' . $att['className'] . '">';

			// Start looping over the query results.
			while ( $query->have_posts() ) { $query->the_post();
				// DO ACTION HOOK AND RUN DEFAULT
				// Contents of the queried post results go here..
				add_action('output_one_result', 'wcn_block_two_render_block_query_builder_default_action', 10, 2);
				do_action('output_one_result', $att, $post);
			}
	 
		echo '</div>';

	}
	 
	// Restore original post data.
	wp_reset_postdata();
	
	$output = ob_get_contents();
	ob_end_clean();

	return $output;
}

// default action
function wcn_block_two_render_block_query_builder_default_action($att, $post) {
	//var_dump($att);
	//var_dump($post);
	setup_postdata($post);
	//
	?>
		<div class="col">
			<div class="card">
				<?php /* var_dump($post); */ ?>
				<?php if ( has_post_thumbnail() ) : ?>
					<?php the_post_thumbnail('large'); ?>
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
						<div class="card-text">
							<?php the_excerpt(); ?>
						</div>
					<?php endif; ?>
					<?php if ( !$att['hideCTA'] ) : ?>
						<a class="btn btn-secondary" href="<?php the_permalink() ?>" title="<?php the_title() ?>"><?php echo $att['ctaContent'] ?></a>
					<?php endif; ?>
				</div>
			</div>
		</div>
	<?php
	//
	wp_reset_postdata();
} 