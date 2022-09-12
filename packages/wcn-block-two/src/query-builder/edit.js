// Import WP API Fetch for calling REST API
import apiFetch from '@wordpress/api-fetch'
// const { apiFetch } = wp

// Import some helpful JS tools
import classnames from 'classnames'
import isUndefined from 'lodash/isUndefined'
import pickBy from 'lodash/pickBy'

// Reactstrap
import { Container, Row, Col, 
		 Card, CardBody, CardGroup, CardImg, CardImgOverlay, CardSubtitle, CardText, CardTitle, 
		 Button, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap'

// custom react component
import Display from '../components/Display'

const { __ } = wp.i18n // Import __() from wp.i18n
//import { Button, CheckboxControl, SelectControl, TabPanel, TextControl, PanelBody, PanelRow } from '@wordpress/components'
const { CheckboxControl, SelectControl, TextControl, PanelBody, PanelRow } = wp.components // Button, TabPanel
const { Component } = wp.element // Fragment, renderToString
const { InspectorControls } = wp.editor
const { withSelect, select } = wp.data // registerStore
// import { withState } from '@wordpress/compose'

// main "edit" class
class myQueryBuilderComponent extends Component {

	// Method for setting the initial state.
	static getInitialState( selectedPostTypes, 
							selectedTerms ) {
	  	return {
			allPostTypes: [],
			selectedPostTypes: selectedPostTypes,
			allTaxonomies: [],
			allTerms: [],
			selectedTerms: selectedTerms,
			theTerms: [],
			activeTab: '1',
	  	}
	}

	// Constructing our component. With super() we are setting everything to 'this'.
	// Now we can access the attributes with this.props.attributes
	constructor() {
		super( ...arguments )

		// Try to load previously selected post type and terms
		this.state = this.constructor.getInitialState( 
			this.props.attributes.selectedPostTypes,
			this.props.attributes.selectedTerms
		)
		//console.log("== [MM] getInitialState this.state ==", this.state)

		// Bind so we can use 'this' inside the method
		this.getPostTypes = this.getPostTypes.bind(this)
		// Load post types into state
		this.getPostTypes()

		// Bind so we can use 'this' inside the method
		this.getTaxonomies = this.getTaxonomies.bind(this)
		// Load taxonomies into state
		this.getTaxonomies()
		
		// Bind all for this
		this.onChangePostTypes = this.onChangePostTypes.bind(this)
		this.onChangeTerms = this.onChangeTerms.bind(this)
		this.onChangeNumToShow = this.onChangeNumToShow.bind(this)
		this.onChangeOrderBy = this.onChangeOrderBy.bind(this)
		this.onChangeOrder = this.onChangeOrder.bind(this)
		this.onChangeExcludeIDs = this.onChangeExcludeIDs.bind(this)
		this.onChangeLayout = this.onChangeLayout.bind(this)
		this.onChangeHideTitle = this.onChangeHideTitle.bind(this)
		this.onChangeHideDate = this.onChangeHideDate.bind(this)
		this.onChangeHideFeaturedMedia = this.onChangeHideFeaturedMedia.bind(this)
		this.onChangeHideExcerpt = this.onChangeHideExcerpt.bind(this)
		this.onChangeExcerptWordCount = this.onChangeExcerptWordCount.bind(this)
		this.onChangeHideCTA = this.onChangeHideCTA.bind(this)
		this.onChangeCTAContent = this.onChangeCTAContent.bind(this)
		this.onChangeColumnsXS = this.onChangeColumnsXS.bind(this)
		this.onChangeColumnsSM = this.onChangeColumnsSM.bind(this)
		this.onChangeColumnsMD = this.onChangeColumnsMD.bind(this)
		this.onChangeColumnsLG = this.onChangeColumnsLG.bind(this)
		this.onChangeColumnsXL = this.onChangeColumnsXL.bind(this)
		this.outputOneResult = this.outputOneResult.bind(this)
		this.toggleTabs = this.toggleTabs.bind(this)
	}

	componentDidMount() {
		//console.log('componentDidMount')
	}

	componentWillMount() {
		this.isStillMounted = true
		//console.log('componentWillMount')
	}

	componentWillUnmount() {
		this.isStillMounted = false
		//console.log('componentWillUnmount')
	}

	componentWillReceiveProps(nextProps) {
        // if(nextProps.value !== this.props.value){
        //     this.setState({count:nextProps.value})
		// }
		//console.log('componentWillReceiveProps:', nextProps)
    }

	getPostTypes() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/types' } ).then( ( allPostTypes ) => {
				// don't allow media attachments or gutenberg blocks
				delete allPostTypes["attachment"]
				delete allPostTypes["wp_block"]
				//console.log('== [MM] allPostTypes ==', allPostTypes)
				this.setState( { allPostTypes }, () => {
					//console.log('== [MM] NEW STATE allPostTypes ==', this.state)
				})
			})
		)
	}

	getTaxonomies() {
		//const getTaxonomies = select('core').getTaxonomies( { per_page: -1 } )
		//console.log("getTaxonomies ATTEMPT ONE:", getTaxonomies)
		
		return (
			apiFetch( { path: '/wp-json/wp/v2/taxonomies'} ).then( ( allTaxonomies ) => {
				//console.log('== [MM] allTaxonomies ==', allTaxonomies)

				// This is the same as { allTaxonomies: allTaxonomies }
				this.setState( { allTaxonomies }, () => {
					//console.log('== [MM] NEW STATE allTaxonomies ==', this.state.allTaxonomies)

					let allTermsNew = []
					Object.keys(this.state.allTaxonomies).forEach( async (tax) => {
						//console.log(tax, this.state.allTaxonomies[tax])
						let taxName = this.state.allTaxonomies[tax].rest_base
						await apiFetch( { path: '/wp-json/wp/v2/'+ this.state.allTaxonomies[tax].rest_base } ).then( (terms) => {
							allTermsNew.push( { 
								'taxonomy': this.state.allTaxonomies[tax].name, 
								'rest': this.state.allTaxonomies[tax].rest_base, 
								'types': this.state.allTaxonomies[tax].types, 
								'terms': terms 
							} ) 
						})
					})
					//console.log("allTermsNew:", allTermsNew)

					this.setState( { allTerms: allTermsNew }, () => {
						//console.log('== [MM] NEW STATE allTerms ==', this.state.allTerms)
					})

				})

			})
		)
	}

	onChangePostTypes(newPostTypes) {
		//console.log("newPostTypes:", newPostTypes)
		this.setState( { selectedPostTypes: newPostTypes } )
		this.props.setAttributes( { selectedPostTypes: newPostTypes } )
		// reset the terms too
		this.setState( { theTerms: [], selectedTerms: [] } )
		this.props.setAttributes( { theTerms: [], selectedTerms: [] } )
	}

	onChangeTerms(e) {
		//console.log("e:", e) // not using "e"
		//console.log("this.state.selectedTerms", this.state.selectedTerms)
		
		var theTerms = []
		var newSelectedTerms = []
		const getTerms = document.querySelectorAll("#termsSelectMulti option:checked")
		//console.log("getTerms", getTerms)
		for (const term of getTerms) {
			newSelectedTerms.push(term.value)
		}
		//console.log("newSelectedTerms", newSelectedTerms)
	
		this.props.setAttributes( { selectedTerms: newSelectedTerms } )

		this.setState( { selectedTerms: newSelectedTerms }, () => {
			//console.log("this.state.selectedTerms", this.state.selectedTerms)
			if (this.state.selectedTerms.length > 0){

				this.state.selectedTerms.map( (theSelectedTerm) => {
					//console.log("theSelectedTerm", theSelectedTerm)
					for (var t = 0; t < this.state.allTerms.length; t++){
						let obj = this.state.allTerms[t].terms.find(o => {
							//console.log("o", o)
							if (o.id == theSelectedTerm) {
								return true
							}
						})
						if (!isUndefined(obj)){
							//console.log("obj", obj)
							obj.taxonomy = this.state.allTerms[t].taxonomy
							obj.rest = this.state.allTerms[t].rest
							obj.types = this.state.allTerms[t].types
							//console.log("obj", obj)
							theTerms.push(obj)
						}
					}
				})

			}

			this.setState( { theTerms: theTerms }, () => {
				console.log("== [MM] this.state.theTerms ==", this.state.theTerms)

				var termsQuery = []
				var thisTerm = {}
				//console.log("theTerms", theTerms)
				
				for (var t = 0; t < theTerms.length; t++){
					//console.log("theTerms[t]", theTerms[t])
					thisTerm = { [theTerms[t].rest]: theTerms[t].id }
					//console.log("thisTerm", thisTerm)

					termsQuery.push(thisTerm)
				}
				//console.log("== [MM] termsQuery 1 ==", termsQuery)

				// reduce to refactor
				termsQuery = termsQuery.reduce((acc, curr) => {
					let key = Object.keys(curr)[0]
					acc[key] = acc[key] ? [curr[key], ...acc[key]] : [curr[key]]
					return acc
				}, {})
				//console.log("== [MM] termsQuery 2 ==", termsQuery)

				this.props.setAttributes( { theTerms: termsQuery } )
			})

		} )
	}

	onChangeNumToShow(newNumToShow) {
		this.props.setAttributes( { numToShow: newNumToShow } )
    }

	onChangeOrderBy(newOrderBy) {
		this.props.setAttributes( { orderBy: newOrderBy } )
    }

	onChangeOrder(newOrder) {
		this.props.setAttributes( { order: newOrder } )
	}

	onChangeExcludeIDs(newExcludeIDs) {
		this.props.setAttributes( { excludeIDs: newExcludeIDs } )
	}

	onChangeLayout(newLayout) {
		this.props.setAttributes( { layout: newLayout } )
	}

	onChangeHideTitle(newHideTitle) {
		this.props.setAttributes( { hideTitle: newHideTitle } )
    }

	onChangeHideDate(newHideDate) {
		this.props.setAttributes( { hideDate: newHideDate } )
    }

	onChangeHideFeaturedMedia(newHideFeaturedMedia) {
		this.props.setAttributes( { hideFeaturedMedia: newHideFeaturedMedia } )
    }

	onChangeHideExcerpt(newHideExcerpt) {
		this.props.setAttributes( { hideExcerpt: newHideExcerpt } )
    }

	onChangeExcerptWordCount(newExcerptWordCount) {
		this.props.setAttributes( { excerptWordCount: newExcerptWordCount } )
    }

	onChangeHideCTA(newHideCTA) {
		this.props.setAttributes( { hideCTA: newHideCTA } )
    }

	onChangeCTAContent(newCTAContent) {
		this.props.setAttributes( { ctaContent: newCTAContent } )
    }

	onChangeColumnsXS(newColumnsXS) {
		this.props.setAttributes( { columnsXS: newColumnsXS } )
    }

	onChangeColumnsSM(newColumnsSM) {
		this.props.setAttributes( { columnsSM: newColumnsSM } )
    }

	onChangeColumnsMD(newColumnsMD) {
		this.props.setAttributes( { columnsMD: newColumnsMD } )
    }

	onChangeColumnsLG(newColumnsLG) {
		this.props.setAttributes( { columnsLG: newColumnsLG } )
    }

	onChangeColumnsXL(newColumnsXL) {
		this.props.setAttributes( { columnsXL: newColumnsXL } )
    }
    
    outputOneResult(item) {
		//console.log("item", item)
		//console.log("this.props.attributes", this.props.attributes)

		const layout = this.props.attributes.layout
		//console.log("layout", layout)

		let thisDate = new Date(item.date)
		thisDate = this.formatDate(thisDate)

		let featuredMediaArray = []
		//console.log("featuredMediaArray", featuredMediaArray)
		let featuredMedia = ''
		try {
			featuredMediaArray = item._embedded['wp:featuredmedia']
			featuredMedia = featuredMediaArray['0'].source_url
			//console.log("featuredMedia", featuredMedia)
		} catch (e) {
			//console.log("e", e)
		}

		switch (layout) {
			case '1' : {
				return (
					<Col xs={this.props.attributes.columnsXS} sm={this.props.attributes.columnsSM} md={this.props.attributes.columnsMD} lg={this.props.attributes.columnsLG} xl={this.props.attributes.columnsXL}>
						<Card className="wcn-card-post-type">
							<CardBody>
								<Display if={!this.props.attributes.hideTitle && typeof item.title.rendered !== 'undefined'}>
									<CardTitle><a href={item.link} title={item.title.rendered}>{item.title.rendered}</a></CardTitle>
								</Display>
								<Display if={!this.props.attributes.hideDate}>
									<CardSubtitle>{thisDate}</CardSubtitle>
								</Display>
								<Display if={!this.props.attributes.hideExcerpt && typeof item.excerpt.rendered !== 'undefined'}>
									<CardText dangerouslySetInnerHTML={ { __html: this.truncateWords(item.excerpt.rendered, this.props.attributes.excerptWordCount) } } />
								</Display>
								<Display if={!this.props.attributes.hideCTA}>
									<Button dangerouslySetInnerHTML={ { __html: this.props.attributes.ctaContent } } />
								</Display>
							</CardBody>
							<Display if={!this.props.attributes.hideFeaturedMedia && featuredMedia !== ''}>
								<CardImg bottom width="100%" src={featuredMedia} alt="Card Image Top" />
							</Display>
						</Card>
					</Col>
				)
			} 
			case '2' : {
				return (
					<Col xs={this.props.attributes.columnsXS} sm={this.props.attributes.columnsSM} md={this.props.attributes.columnsMD} lg={this.props.attributes.columnsLG} xl={this.props.attributes.columnsXL}>
						<Card className="wcn-card-post-type" inverse>
							<Display if={!this.props.attributes.hideFeaturedMedia && featuredMedia !== ''}>
								<CardImg width="100%" src={featuredMedia} alt="Card Image Top" />
							</Display>
							<CardImgOverlay>
								<Display if={!this.props.attributes.hideTitle && typeof item.title.rendered !== 'undefined'}>
									<CardTitle><a href={item.link} title={item.title.rendered}>{item.title.rendered}</a></CardTitle>
								</Display>
								<Display if={!this.props.attributes.hideDate}>
									<CardSubtitle>{thisDate}</CardSubtitle>
								</Display>
								<Display if={!this.props.attributes.hideExcerpt && typeof item.excerpt.rendered !== 'undefined'}>
									<CardText dangerouslySetInnerHTML={ { __html: this.truncateWords(item.excerpt.rendered, this.props.attributes.excerptWordCount) } } />
								</Display>
								<Display if={!this.props.attributes.hideCTA}>
									<Button dangerouslySetInnerHTML={ { __html: this.props.attributes.ctaContent } } />
								</Display>
							</CardImgOverlay>
						</Card>
					</Col>
				)
			} 
			default : {
				return (
					<Col xs={this.props.attributes.columnsXS} sm={this.props.attributes.columnsSM} md={this.props.attributes.columnsMD} lg={this.props.attributes.columnsLG} xl={this.props.attributes.columnsXL}>
						<Card className="wcn-card-post-type">
							<Display if={!this.props.attributes.hideFeaturedMedia && featuredMedia !== ''}>
								<CardImg top width="100%" src={featuredMedia} alt="Card Image Top" />
							</Display>
							<CardBody>
								<Display if={!this.props.attributes.hideTitle && typeof item.title.rendered !== 'undefined'}>
									<CardTitle><a href={item.link} title={item.title.rendered}>{item.title.rendered}</a></CardTitle>
								</Display>
								<Display if={!this.props.attributes.hideDate}>
									<CardSubtitle>{thisDate}</CardSubtitle>
								</Display>
								<Display if={!this.props.attributes.hideExcerpt && typeof item.excerpt.rendered !== 'undefined'}>
									<CardText dangerouslySetInnerHTML={ { __html: this.truncateWords(item.excerpt.rendered, this.props.attributes.excerptWordCount) } } />
								</Display>
								<Display if={!this.props.attributes.hideCTA}>
									<Button dangerouslySetInnerHTML={ { __html: this.props.attributes.ctaContent } } />
								</Display>
							</CardBody>
						</Card>
					</Col>
				)
			}
		}
	}
	
	toggleTabs(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			})
		}
	}

	formatDate(date) {
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		]
	  
		var day = date.getDate()
		var monthIndex = date.getMonth()
		var year = date.getFullYear()
	  
		return monthNames[monthIndex] + ' ' + day + ', ' + year
	}

	truncateWords(str, numWords) {
		return str.split(" ").splice(0,numWords).join(" ") + '...'
	}
  
	render() {
			
		let outputPostTypes = __( 'Loading Post Types' )
        let outputTerms = __( 'Loading Terms' )
		let postTypeOptions = [ { value: 0, label: __( 'Choose Post Type' ) } ]

		// if this block is selected right now
		let isSelected = this.props.isSelected
        //console.log(isSelected)


        /*
         * coming back from "higher-order component" wrap of withSelect() as attributes
         */

		// latest payload
		let hasLatest = false
		let theLatest = []
		if ( this.props.latestPayload !== 'undefined' 
            && this.props.latestPayload !== null
            && this.props.latestPayload.length > 0
        ) {
            hasLatest = true
			theLatest = this.props.latestPayload
			//console.log("theLatest", theLatest)
		}


		// if we have stored any post types
		if ( Object.keys(this.state.allPostTypes).length > 0 ) {
			
			const loading = __( 'We have %d post types. Choose one or many.' )
			outputPostTypes = loading.replace( '%d', Object.keys(this.state.allPostTypes).length )
			
			// put stored post types in the "postTypeOptions" array
			for (var thePostType in this.state.allPostTypes) {
				//console.log(this.state.allPostTypes[thePostType])
				postTypeOptions.push( { value: this.state.allPostTypes[thePostType].slug, label: this.state.allPostTypes[thePostType].name } )
			}
			
		} else {
			outputPostTypes = __( 'No post types found. Please create some first?' )
		}

		// if we have stored any terms
		if ( this.state.allTerms.length > 0 ) {
			
			const loading = __( 'We have %d taxonomy term payloads. Choose one or many.' )
			outputTerms = loading.replace( '%d', Object.keys(this.state.allTerms).length )

			//console.log("this.state.allTerms", this.state.allTerms)

			const allTermsOptions = this.state.allTerms.map( (tax) => {
				//console.log('tax', tax)
				return {[tax.taxonomy]: tax.terms.map( (term) => { 
					//console.log('term', term)
					return { value: term.id, label: term.name, slug: term.slug } }
				)}
			})
			//console.log("allTermsOptions", allTermsOptions)
			
		} else {
			outputTerms = __( 'No terms found. Please create some first?' )
		}


		// if we have anything in the object -- && this.state.selectedPostTypes.hasOwnProperty('title')
		if ( typeof this.state.selectedPostTypes !== 'undefined' && this.state.selectedPostTypes.length > 0 ) {
			outputPostTypes = (
				<div className="post-types">
					Selected Post Types: { this.state.selectedPostTypes }
				</div>
			)
			this.props.className += ' has-post-types'
		} else {
			this.props.className += ' no-post-types'
		}

		// if we have anything in the object
		if ( typeof this.state.selectedTerms !== 'undefined' && this.state.selectedTerms.length > 0 ) {
			outputTerms = (
				<div className="terms">
					Selected Term IDs: { this.state.selectedTerms.join(", ") }
				</div>
			)
			this.props.className += ' has-terms'
		} else {
			this.props.className += ' no-terms'
		}


		// return the render!
		return [
			isSelected && ( 
				1 === 1
			), 
			<div className={this.props.className + " wcn-post-type"}>

				<div className="row">
					{outputPostTypes}
				</div>

				<div className="row">
					{outputTerms}
				</div>

                <div className="row">
					<Container>
						<Row>
						{ 
							hasLatest ? (

								theLatest.map( (item, i) => {
									//console.log("this.outputOneResult(item):", this.outputOneResult(item))
									return this.outputOneResult(item)
								})

							) : ''
						}
						</Row>
					</Container>
                </div>

				<InspectorControls>
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: this.state.activeTab === '1' })}
								onClick={() => { this.toggleTabs('1') }}
							>
								Query
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: this.state.activeTab === '2' })}
								onClick={() => { this.toggleTabs('2') }}
							>
								Display
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="1">
							<PanelBody>
								<PanelRow>
									<SelectControl 
										onChange={ this.onChangePostTypes } 
										value={ this.props.attributes.selectedPostTypes } 
										label={ __( 'Post Types' ) } 
										options={ postTypeOptions } 
										multiple={ false }
									/>
								</PanelRow>
								{ this.state.allTerms.map( (name) => {
									//console.log("name", name)
									// console.log("name.taxonomy", name.taxonomy)

									const thisTermsOptions = name.terms.map( (term) => {
										return { value: term.id, label: term.name, slug: term.slug } 
									})
									
									var showOptions = false
									
									for (var i = 0; i < name.types.length; i++) {
										//console.log(this.props.attributes.selectedPostTypes, name.types[i])
										if ( this.props.attributes.selectedPostTypes === name.types[i] ) {
											showOptions = true
										}
									}

									return (
										<Display key={ Math.random } if={ showOptions }>
											<PanelRow>
												<SelectControl 
													id="termsSelectMulti" 
													label={ __( name.taxonomy ) } 
													options={ thisTermsOptions } 
													multiple={ true }
													onChange={ this.onChangeTerms } 
													value={ this.props.attributes.selectedTerms }
												/>
											</PanelRow>
										</Display>
									)
								} ) }
							</PanelBody>
							<PanelBody>
								<PanelRow>
									<TextControl
										label="# To Show"
										type="number"
										value={ this.props.attributes.numToShow }
										onChange={ this.onChangeNumToShow }
									/>
								</PanelRow>
								<PanelRow>
									<SelectControl
										label={ __( 'Order By' ) }
										value={ this.props.attributes.orderBy }
										onChange={ this.onChangeOrderBy }
										options={ [ 
											{ value: 'author', label: 'author' },
											{ value: 'date', label: 'date' },
											{ value: 'id', label: 'id' },
											{ value: 'modified', label: 'modified' },
											{ value: 'parent', label: 'parent' },
											{ value: 'slug', label: 'slug' },
											{ value: 'title', label: 'title' },
										] }
									/>
								</PanelRow>
								<PanelRow>
									<SelectControl
										label={ __( 'Order' ) }
										value={ this.props.attributes.order }
										onChange={ this.onChangeOrder }
										options={ [
											{ value: 'asc', label: 'asc' },
											{ value: 'desc', label: 'desc' },
										] }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Exclude IDs"
										type="text"
										value={ this.props.attributes.excludeIDs }
										onChange={ this.onChangeExcludeIDs }
									/>
								</PanelRow>
							</PanelBody>
						</TabPane>
						<TabPane tabId="2">
							<PanelBody>
								<PanelRow>
									<SelectControl
										label={ __( 'Layout' ) }
										value={ this.props.attributes.layout }
										onChange={ this.onChangeLayout }
										options={ [ 
											{ value: '0', label: 'Image on Top' },
											{ value: '1', label: 'Image on Bottom' },
											{ value: '2', label: 'Image Overlay' },
										] }
									/>
								</PanelRow>
								<PanelRow>
									<CheckboxControl
										label="Hide Title?"
										checked={ this.props.attributes.hideTitle }
										onChange={ this.onChangeHideTitle }
									/>
								</PanelRow>
								<PanelRow>
									<CheckboxControl
										label="Hide Date?"
										checked={ this.props.attributes.hideDate }
										onChange={ this.onChangeHideDate }
									/>
								</PanelRow>
								<PanelRow>
									<CheckboxControl
										label="Hide Featured Media?"
										checked={ this.props.attributes.hideFeaturedMedia }
										onChange={ this.onChangeHideFeaturedMedia }
									/>
								</PanelRow>
								<PanelRow>
									<CheckboxControl
										label="Hide Excerpt?"
										checked={ this.props.attributes.hideExcerpt }
										onChange={ this.onChangeHideExcerpt }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Excerpt Word Count"
										type="number"
										value={ this.props.attributes.excerptWordCount }
										onChange={ this.onChangeExcerptWordCount }
									/>
								</PanelRow>
								<PanelRow>
									<CheckboxControl
										label="Hide CTA?"
										checked={ this.props.attributes.hideCTA }
										onChange={ this.onChangeHideCTA }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="CTA Content"
										type="text"
										value={ this.props.attributes.ctaContent }
										onChange={ this.onChangeCTAContent }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Column Width XS"
										type="number"
										value={ this.props.attributes.columnsXS }
										onChange={ this.onChangeColumnsXS }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Column Width SM"
										type="number"
										value={ this.props.attributes.columnsSM }
										onChange={ this.onChangeColumnsSM }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Column Width MD"
										type="number"
										value={ this.props.attributes.columnsMD }
										onChange={ this.onChangeColumnsMD }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Column Width LG"
										type="number"
										value={ this.props.attributes.columnsLG }
										onChange={ this.onChangeColumnsLG }
									/>
								</PanelRow>
								<PanelRow>
									<TextControl
										label="Column Width XL"
										type="number"
										value={ this.props.attributes.columnsXL }
										onChange={ this.onChangeColumnsXL }
									/>
								</PanelRow>
							</PanelBody>
						</TabPane>
					</TabContent>
				</InspectorControls>

			</div>
		] // end return
	} // end render
} // end class


export default withSelect( ( select, props ) => {
    
    //console.log("== [MM] select ==")
    //console.log(select)
    //console.log("== [MM] props ==")
    //console.log(props)
    
	const { 
		selectedPostTypes,
		theTerms,
		numToShow, 
		orderBy, 
		order,
		excludeIDs
	} = props.attributes
	
	const _embed = true
	const urlParams = new URLSearchParams(window.location.search)
	var excludeThese = urlParams.get('post')
	excludeThese = excludeIDs !== '' ? excludeThese + ',' + excludeIDs : excludeThese
	//console.log("excludeThese", excludeThese)
	//console.log("excludeIDs", excludeIDs)

	const { getEntityRecords, getTaxonomies } = select( 'core' )
	//console.log("getEntityRecords", getEntityRecords)
	//console.log("order", order)

	var latestPostsQuery = {}
	var theLatestPosts = []
	var theLatest = []

	latestPostsQuery = pickBy( {
		per_page: numToShow,
		orderby: orderBy,
		order: order,
		_embed,
		exclude: excludeThese
	}, ( value ) => ! isUndefined( value ) && value !== '')
	//console.log("== [MM] latestPostsQuery ==", latestPostsQuery)

	// merge objects
	latestPostsQuery = {...latestPostsQuery, ...theTerms}
	//console.log("== [MM] latestPostsQuery ==", latestPostsQuery)

	// get and set data, then merge/spread into a payload
	theLatestPosts = getEntityRecords( 'postType', selectedPostTypes, latestPostsQuery )
	if ( theLatestPosts == null ) { theLatestPosts = [] }
	//console.log("selectedPostTypes", selectedPostTypes)
	//console.log("== [MM] theLatestPosts ==", theLatestPosts)

	// merge arrays using spread operator (es6)
	theLatest = [...theLatest, ...theLatestPosts]
	//console.log("== [MM] theLatest ==", theLatest)

    return {
		latestPayload: theLatest
	}
} )( myQueryBuilderComponent )