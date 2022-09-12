/**
 * BLOCK: wcn-query-builder
 *
 * Registering an editable block with Gutenberg.
 * Simple block, renders and saves the same content with interactivity.
 */

// Import CSS
import './style.scss'
import './editor.scss'

// this block's edit component class
import edit from './edit'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks

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
 *                             registered, otherwise `undefined`.
 */
registerBlockType( 'wcn/query-builder-julian', 
{
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WCN Query Builder J' ), // Block title.
	icon: 'controls-repeat', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'query builder' ),
		__( 'dynamic block' ),
		__( 'server side render' ),
	],

	attributes: {
		selectedPost: {
			type: 'number',
			default: 0,
		},
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
		// OR
		selectedPostTypes: {
			type: 'string',
			default: '',
		},
		selectedCategories: {
			type: 'array',
			default: '',
		},
		selectedTags: {
			type: 'array',
			default: '',
		},
		selectedTaxonomies: {
			type: 'array',
			default: '',
		},
		selectedTerms: {
			type: 'array',
			default: '',
		},
		// per_page attribute
		numToShow: {
			type: 'string',
			default: '12',
		},
		// orderBy is not working in this version
		orderBy: {
			type: 'string',
			default: 'date',
		},
		// order must be 'asc' or 'desc' case-sensitive
		order: {
			type: 'string',
			default: 'desc',
		},
		excludeIDs: {
			type: 'string',
			default: '',
		},
		// display attributes
		hideTitle: {
			type: 'boolean',
			default: false,
		},
		hideDate: {
			type: 'boolean',
			default: false,
		},
		hideFeaturedMedia: {
			type: 'boolean',
			default: false,
		},
		hideExcerpt: {
			type: 'boolean',
			default: false,
		},
		excerptWordCount: {
			type: 'string',
			default: '30',
		},
		hideCTA: {
			type: 'boolean',
			default: false,
		},
		ctaContent: {
			type: 'string',
			default: 'Call-To-Action',
		},
		columnsToShow: {
			type: 'string',
			default: '4',
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
	edit,
	//edit: myDynamicBlock,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: () => {
        // Rendering in PHP
		return null;
	}
} )
