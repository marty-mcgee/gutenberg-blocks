/**
 * BLOCK: wcn-button
 *
 * Registering an editable block with Gutenberg.
 * Simple block, renders and saves the same content with interactivity.
 */

// Import CSS
import './style.scss'
import './editor.scss'

// Material UI
//import MUIButton from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// Reactstrap
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks
const { SelectControl, TextControl, PanelBody, PanelRow } = wp.components // Button
const { Component, Fragment } = wp.element
const { RichText, PlainText, BlockControls, AlignmentToolbar, 
		MediaUpload, InspectorControls, ColorPalette } = wp.editor

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
registerBlockType( 'wcn/button', 
{
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WCN Button' ), // Block title.
	icon: 'video-alt3', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'WCN Button' ),
		__( 'material ui vs. bootstrap' ),
		__( 'button' ),
	],

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'span',
		},
		backgroundColor: {
			type: 'string',
			default: '',
		},
		color: {
			type: 'string',
			default: '',
		},
		borderWidth: {
			type: 'string',
			default: '5',
			
            // source: 'html',
			// selector: 'p',
			
			// source: 'attribute',
			// selector: 'input',
			
			// attribute: 'value',
			// selector: '#borderWidth',
			// source: 'value'
			
			// source: "text",
			// source: 'meta',
			// meta: 'borderWidth',
		},
		borderRadius: {
			type: 'string',
			default: '10',									
		},
		link: {
			type: 'string',
			selector: 'a',
			default: '#button-link',
		},

		alignment: {
			type: 'string',
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
	edit: ( props ) => {

		const onChangeContent = newContent => {
			props.setAttributes( { content: newContent } )
			//console.log('content changed to:', props.attributes.content)
		}

		const onChangeBGColor = newBGColor => {
			props.setAttributes( { backgroundColor: newBGColor } )
		}

		const onChangeColor = newColor => {
			props.setAttributes( { color: newColor } )
		}

		const onChangeBorderWidth = newBorderWidth => {
			//props.setAttributes( { borderWidth: newBorderWidth.target.value } )
			props.setAttributes( { borderWidth: newBorderWidth } )
		}

		const onChangeBorderRadius = newBorderRadius => {
			//props.setAttributes( { borderRadius: newBorderRadius.target.value } )
			props.setAttributes( { borderRadius: newBorderRadius } )
		}

		const onChangeAlignment = newAlignment => {
			props.setAttributes( { alignment: newAlignment } )
		}

		// We can use inline-style
		const customStyle = {
			// background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
			backgroundColor: props.attributes.backgroundColor,
			color: props.attributes.color,
			borderWidth: props.attributes.borderWidth + 'px',
			borderRadius: props.attributes.borderRadius + 'px',
			//height: 48,
			//padding: '0 30px',
			//boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		}

		const handleClickInEdit = () => {
			console.log('handleClickInEdit this is:', this);
		}

		// Creates a <div class='wp-block-wcn-button'></div>
		return (
			<div className={ props.className }>

				<InspectorControls>
					<PanelBody>
						<PanelRow>
							<strong>BG color:</strong>
							<ColorPalette
								onChange={ onChangeBGColor }
								value={ props.attributes.backgroundColor }
							/>
						</PanelRow>
						<PanelRow>
							<strong>Text color:</strong>
							<ColorPalette
								onChange={ onChangeColor }
								value={ props.attributes.color }
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody>
						<PanelRow>
							{/* Border Width: */}
							{/* <RichText
								tagName= 'p'
								className={ props.className }
								onChange={ onChangeBorderWidth }
								value={ props.attributes.borderWidth }
							/> */}
							{/* <form>
								<TextField
									name='borderWidth'
									label='Border Width:'
									value={ props.attributes.borderWidth }
									onChange={ onChangeBorderWidth }
									margin='normal'
								/>
							</form> */}
							{/* <input 
								id="borderWidth"
								type="text"
								value={ props.attributes.borderWidth }
								onChange={ onChangeBorderWidth }
							/> */}
							<TextControl
								label="Border Width"
								type="number"
								value={ props.attributes.borderWidth }
								onChange={ onChangeBorderWidth }
							/>
						</PanelRow>
						<PanelRow>
							{/* Border Radius: */}
							{/* <RichText
								tagName= 'p'
								className={ props.className }
								onChange={ onChangeBorderRadius }
								value={ props.attributes.borderRadius }
							/> */}
							{/* <InputGroup>
								<InputGroupAddon addonType="prepend">Border Radius:</InputGroupAddon>
								<Input type="number" 
									placeholder="in px" 
									step="1"
									onChange={ onChangeBorderRadius } 
									value={ props.attributes.borderRadius }
								/>
							</InputGroup> */}
							<TextControl
								label="Border Radius"
								type="number"
								value={ props.attributes.borderRadius }
								onChange={ onChangeBorderRadius }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			
				<BlockControls>
					<AlignmentToolbar
						value={ props.attributes.alignment }
						onChange={ onChangeAlignment }
					/>
				</BlockControls>
				
				{/* <MUIButton variant="contained" color={ props.attributes.color }> */}
				{/* <MUIButton variant="contained" style={ customStyle }> */}
				{/* <Button outline style={ customStyle } size="lg" color="primary" onClick={ handleClickInEdit } 
						isLink={ false } href="#react"> */}
				<Button style={ customStyle }>
					<RichText
						tagName="span"
						isSelected={ false }
						placeholder={ __('Write the content') }
						onChange={ onChangeContent }
						value={ props.attributes.content }
						style={ { textAlign: props.attributes.alignment } }
					/>
				</Button>
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

		// We can use inline-style
		const customStyle = {
			// background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
			backgroundColor: props.attributes.backgroundColor,
			color: props.attributes.color,
			borderWidth: props.attributes.borderWidth + 'px',
			borderRadius: props.attributes.borderRadius + 'px',
			//height: 48,
			//padding: '0 30px',
			//boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		}

		// ain't gonna happen
		const handleClickInSave = () => {
			console.log('handleClickInSave this is:', this);
		}

		return (
			<div className={ props.className }>
				
				{/* <script>
					// might happen
					handleClickInSave = function()
						console.log('handleClickInSave this is:', this)
					
				</script> */}

				{/* <MUIButton variant="contained" color={ props.attributes.color }> */}
				{/* <MUIButton variant="contained" style={ customStyle }> */}
				{/* <Button outline style={ customStyle } size="lg" color="primary" onClick={ handleClickInSave } 
						isLink={ false } href="#react"> */}
				<Button style={ customStyle } >
					<RichText.Content
						tagName="span"
						placeholder={ __('Write the content')}
						value={ props.attributes.content }
						style={ { textAlign: props.attributes.alignment } }
					/>
				</Button>

			</div>
		)
	}
} );
