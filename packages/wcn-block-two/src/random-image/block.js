/**
 * BLOCK: wcn-random-image
 *
 * Registering an editable block with Gutenberg.
 * Simple block, renders and saves the same content with interactivity.
 */

// Import CSS
import './style.scss'
import './editor.scss'

// Import WP API Fetch (after installing it with npm install @wordpress/api-fetch --save)
import apiFetch from '@wordpress/api-fetch'

const { __ } = wp.i18n // import __() from wp.i18n
const { registerBlockType, query } = wp.blocks // import registerBlockType() from wp.blocks
const { SelectControl, Button, PanelBody, PanelRow } = wp.components
const { Component, Fragment } = wp.element
const { RichText, BlockControls, AlignmentToolbar, MediaUpload, InspectorControls } = wp.editor

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
					<SelectControl onChange={this.onChangeSelectPost} value={ this.props.attributes.selectedPost } label={ __( 'Select a Post' ) } options={ options } />
				
			), 
			<div className={this.props.className}>{output}</div>
		]
		//return ( 'Load Post Placeholder' );
	}
}

/* RANDOM IMAGE GENERATOR */
function RandomImage( { category } ) {
    const src = 'https://placeimg.com/320/220/' + category;
    return <img src={ src } alt={ category } />;
}

/**
 * Register: a Gutenberg Block.
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
registerBlockType( 'wcn/random-image', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WCN Random Image' ), // Block title.
	icon: 'format-image', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wcn-block-two — Random Image' ),
		__( 'image' ),
		__( 'random' ),
	],

	attributes: {
		title: {
			type: 'string',
			selector: 'h2'
		},
		content: {
			type: 'array',
			source: 'children',
			selector: 'p',
		},
		link: {
			type: 'string',
			selector: 'a'
		},
		selectedPost: {
			type: 'number',
			default: 0,
		},
		alignment: {
			type: 'string'
		},
		tracks: {
			type: 'array',
			source: 'children',
			selector: '.tracks'
		},
		instructions: {
			type: 'array',
			source: 'children',
			selector: '.instructions'
		},
		mediaID: {
			type: 'number'
		},
		mediaURL: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src'
		},
		category: {
			type: 'string',
			default: 'nature'
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: ( props ) => {

		const { attributes: { category }, setAttributes } = props;
		
		function setCategory( event ) {
			const selected = event.target.querySelector( 'option:checked' );
			setAttributes( { category: selected.value } );
			event.preventDefault();
		}

		
		const onChangeTitle = newTitle => {
			props.setAttributes( { title: newTitle })
		}

		const onChangeContent = newContent => {
			props.setAttributes( { content: newContent })
		}

		const onChangeAlignment = newAlignment => {
			props.setAttributes( { alignment: newAlignment })
		}

		const onChangeTracks = newTracks => {
			props.setAttributes( { tracks: newTracks } )
		}

		const onChangeInstructions = newInstructions => {
			props.setAttributes( { instructions: newInstructions } )
		}

		const onSelectImage = newImage => {
			props.setAttributes( { 
				mediaID: newImage.id,
				mediaURL: newImage.url
			} )
		}

		// Creates a <p class='wp-block-wcn-random-image'></p>.
		return (
			<div className={ props.className }>

				<InspectorControls>
					<PanelBody>
						<PanelRow>
							Current category is: {category}
						</PanelRow>
						<PanelRow>
							<form onSubmit={ setCategory }>
								<select value={ category } onChange={ setCategory }>
									<option value="animals">Animals</option>
									<option value="arch">Architecture</option>
									<option value="nature">Nature</option>
									<option value="people">People</option>
									<option value="tech">Tech</option>
								</select>
							</form>
						</PanelRow>
					</PanelBody>
					<PanelBody>
						<PanelRow>
							...
						</PanelRow>
						<PanelRow>
							...
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				
				<div className="column">

					<RandomImage category={ category } />

				</div>
				<div className="column">

					

				</div>

			</div>
		)
	},
	// The "edit" property must be a valid function.
	//edit: mySelectPosts,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: ( props ) => {
		
			const { attributes: { category } } = props;

		return (
			<div className={ props.className }>

				<div className="column">

					<RandomImage category={ category } />

				</div>
				<div className="column">

					Current category is: {category}

				</div>

			</div>
		)
	}
} );
