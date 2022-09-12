/**
 * BLOCK: wcn-editable-block
 *
 * Registering an editable block with Gutenberg.
 * Simple block, renders and saves the same content with interactivity.
 */

// Import CSS
import './style.scss'
import './editor.scss'

// Import WP API Fetch (after installing it with npm install @wordpress/api-fetch --save)
import apiFetch from '@wordpress/api-fetch'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks
const { SelectControl, Button, PanelBody, PanelRow } = wp.components
const { Component, Fragment } = wp.element
const { RichText, BlockControls, AlignmentToolbar, MediaUpload, InspectorControls } = wp.editor


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
registerBlockType( 'wcn/editable-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WCN Editable Block' ), // Block title.
	icon: 'media-document', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'WCN Editable Block' ),
		__( 'editable' ),
		__( 'tracks' ),
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

		// Creates a <p class='wp-block-wcn-editable-block'></p>.
		return (
			<div className={ props.className }>

				<InspectorControls>
					<PanelBody>
						<PanelRow>
							...
						</PanelRow>
						<PanelRow>
							...
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
			
				<BlockControls>
					<AlignmentToolbar
						value={ props.attributes.alignment }
						onChange={ onChangeAlignment }
					/>
				</BlockControls>
				
				<div className="column">

					<RichText
						tagName="h2"
						className="title"
						isSelected={ false }
						placeholder={ __('Write a title') }
						onChange={ onChangeTitle }
						value={ props.attributes.title }
						style={ { textAlign: props.attributes.alignment } }
					/>

					<h3>{ __('Content')}</h3>
					<RichText
						tagName="p"
						className="content"
						isSelected={ false }
						placeholder={ __('Write the content') }
						onChange={ onChangeContent }
						value={ props.attributes.content }
						style={ { textAlign: props.attributes.alignment } }
					/>

					<h3>{ __('Tracks')}</h3>
					<RichText
						tagName="ul"
						multiline="li"
						className="tracks"
						isSelected={ false }
						placeholder={ __('Write a list of tracks...')}
						value={ props.attributes.tracks }
						onChange={ onChangeTracks }
						/>
						
					<h3>{ __('Instructions')}</h3>
					<RichText
						tagName="div"
						multiline="p"
						className="instructions"
						isSelected={ false }
						placeholder={ __('Write the instructions...')}
						value={ props.attributes.instructions }
						onChange={ onChangeInstructions }
						/>

				</div>
				<div className="column">
					
					<div className="album-image">
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ props.attributes.mediaID }
							render={ ( { open } ) => (
								<Button 
									onClick={ open }
									className={ props.attributes.mediaID ? 'image-button': 'button button-large' }
								>
									{ ! props.attributes.mediaID ? __( 'Upload Image'): <img src={ props.attributes.mediaURL } /> }
								</Button>
							) }
						/>
					</div>

				</div>
				{/* <p>— HEY HEY HEY from the backend.</p>
				<p>CGB BLOCK: <code>wcn-editable-block</code> is a new Gutenberg block</p>
				<p>props.className: { props.className }</p> */}

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
		return (
			<div className={ props.className }>
				
				{/* <div className="post">
					<a href={ props.attributes.link }><h2 dangerouslySetInnerHTML={ { __html: props.attributes.title } }></h2></a>
					<p dangerouslySetInnerHTML={ { __html: props.attributes.content } }></p>
				</div> */}

				<div className="column">
					<RichText.Content
						tagName="h1"
						className="title"
						placeholder={ __('Write a title')}
						value={ props.attributes.title }
						/>

					<h3>{ __('Content')}</h3>
					<RichText.Content
						tagName="p"
						className="content"
						placeholder={ __('Write the content...')}
						value={ props.attributes.content }
						/>

					<h3>{ __('Tracks')}</h3>
					<RichText.Content
						tagName="ul"
						multiline="li"
						className="tracks"
						placeholder={ __('Write a list of tracks...')}
						value={ props.attributes.tracks }
						/>
						
					<h3>{ __('Instructions')}</h3>
					<RichText.Content
						tagName="div"
						multiline="p"
						className="instructions"
						placeholder={ __('Write the instructions...')}
						value={ props.attributes.instructions }
						/>
				</div>
				<div className="column">
					<div className="album-image">
						{
							props.attributes.mediaURL && (
								<img src={ props.attributes.mediaURL } />
							)
						}
					</div>
				</div>

			</div>
		)
	}
} );
