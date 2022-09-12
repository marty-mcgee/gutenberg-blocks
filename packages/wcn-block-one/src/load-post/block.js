/**
 * BLOCK: wcn-load-post
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

// Import CSS
import './style.scss';
import './editor.scss';

// Import WP API Fetch (after installing it with npm install @wordpress/api-fetch --save)
import apiFetch from '@wordpress/api-fetch';

const { __ } = wp.i18n; // import __() from wp.i18n
const { registerBlockType } = wp.blocks; // import registerBlockType() from wp.blocks
const { SelectControl } = wp.components;
const { Component } = wp.element;
const { RichText, BlockControls, InspectorControls } = wp.editor;

class mySelectPosts extends Component {

	// Method for setting the initial state.
	static getInitialState( selectedPost ) {
	  	return {
			posts: [],
			selectedPost: selectedPost,
			post: {}, 
	  	};
	}

	// Constructing our component. With super() we are setting everything to 'this'.
	// Now we can access the attributes with this.props.attributes
	constructor() {
		super( ...arguments );
		// Maybe we have a previously selected post. Try to load it.
		this.state = this.constructor.getInitialState( this.props.attributes.selectedPost );
		console.log('[MM] this.state:');
		console.log(this.state);
		// Bind so we can use 'this' inside the method.
		console.log('[MM] about to bind it 1');
		this.getOptions = this.getOptions.bind(this);
		console.log(this.getOptions);
		console.log('[MM] bound 1');
		// Load posts.
		console.log('[MM] about to getOptions()');
		this.getOptions();
		console.log('[MM] about to bind it 2');
		// Bind it.
		this.onChangeSelectPost = this.onChangeSelectPost.bind(this);
		console.log('[MM] bound 2');
	}

	/**
	 * Loading Posts
	 */
	getOptions() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/posts' } ).then( ( posts ) => {
				console.log( posts );
				if( posts && 0 !== this.state.selectedPost ) {
					// If we have a selected Post, find that post and add it.
					const post = posts.find( ( item ) => { return item.id == this.state.selectedPost } );
					// This is the same as { post: post, posts: posts }
					this.setState( { post, posts } );
				} else {
					this.setState( { posts } );
				}
			})
		);
	}

	onChangeSelectPost( value ) {
		// Find the post
		const post = this.state.posts.find( ( item ) => { return item.id == parseInt( value ) } );
		// Set the state
		this.setState( { selectedPost: parseInt( value ), post } );
		// Set the attributes
		this.props.setAttributes( {
			selectedPost: parseInt( value ),
			title: post.title.rendered,
			content: post.excerpt.rendered,
			link: post.link,
		});
	}
  
	render() {
		let options = [ { value: 0, label: __( 'Select a Post' ) } ];
		let output = __( 'Loading Posts' );
		this.props.className += ' loading';

		let isSelected = this.props.isSelected;
		console.log(isSelected);

		if ( this.state.posts.length > 0 ) {
			const loading = __( 'We have %d posts. Choose one.' );
			output = loading.replace( '%d', this.state.posts.length );
			this.state.posts.forEach((post) => {
				options.push({value:post.id, label:post.title.rendered});
			});
		} else {
			output = __( 'No posts found. Please create some first.' );
		}
		// Checking if we have anything in the object
		if ( this.state.post.hasOwnProperty('title') ) {
			output = <div className="post">
				<a href={ this.state.post.link }><h2 dangerouslySetInnerHTML={ { __html: this.state.post.title.rendered } }></h2></a>
				<p dangerouslySetInnerHTML={ { __html: this.state.post.excerpt.rendered } }></p>
			</div>;
			this.props.className += ' has-post';
		} else {
			this.props.className += ' no-post';
		}
		return [
			isSelected && ( 
				<InspectorControls key='inspector'>
					<SelectControl 
						onChange={this.onChangeSelectPost} 
						value={ this.props.attributes.selectedPost } 
						label={ __( 'Select a Post' ) } 
						options={ options } 
					/>
				</InspectorControls>
			), 
			<div className={this.props.className}>{output}</div>
		]
		//return ( 'Load Post Placeholder' );
	}
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'wcn/load-post', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WCN Load Post' ), // Block title.
	icon: 'format-aside', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'WCN Load Post' ),
		__( 'load' ),
		__( 'post' ),
	],

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'p',
		},
		title: {
			type: 'string',
			selector: 'h2'
		},
		link: {
			type: 'string',
			selector: 'a'
		},
		selectedPost: {
			type: 'number',
			default: 0,
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	// edit: function( props ) {
	// 	// Creates a <p class='wp-block-wcn-load-post'></p>.
	// 	return (
	// 		<div className={ props.className }>
	// 			<p>— HEY HEY HEY from the backend.</p>
	// 			<p>
	// 				CGB BLOCK: <code>wcn-load-post</code> is a new Gutenberg block
	// 			</p>
	// 			<p>
	// 				{ props.className }
	// 			</p>
	// 			<p>
	// 				It was created via{ ' ' }
	// 				<code>
	// 					<a href="https://github.com/ahmadawais/create-guten-block">
	// 						create-guten-block
	// 					</a>
	// 				</code>.
	// 			</p>
	// 		</div>
	// 	);
	// },
	// The "edit" property must be a valid function.
	edit: mySelectPosts,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
		return (
			<div className={ props.className }>
				<div className="post">
					<a href={ props.attributes.link }><h2 dangerouslySetInnerHTML={ { __html: props.attributes.title } }></h2></a>
					<p dangerouslySetInnerHTML={ { __html: props.attributes.content } }></p>
				</div>
			</div>
		);
	},
} );
