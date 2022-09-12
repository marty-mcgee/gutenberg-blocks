// Import WP API Fetch for calling REST API
import apiFetch from '@wordpress/api-fetch'
// const { apiFetch } = wp

// Import some helpful JS tools
import classnames from 'classnames'
import isUndefined from 'lodash/isUndefined'
import pickBy from 'lodash/pickBy'

// Reactstrap
import { Container, Row, Col, 
		 Button, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle,
		 Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap'

// custom react component
import Display from '../components/Display'

const { __ } = wp.i18n // Import __() from wp.i18n
//import { Button, CheckboxControl, SelectControl, TabPanel, TextControl, PanelBody, PanelRow } from '@wordpress/components'
const { CheckboxControl, SelectControl, TextControl, PanelBody, PanelRow, Spinner } = wp.components // Button, TabPanel
const { Component } = wp.element // Fragment, renderToString
const { InspectorControls } = wp.editor
const { registerStore, withSelect } = wp.data // registerStore
// import { withState } from '@wordpress/compose'

// main "edit" class
class myQueryBuilderComponent extends Component {

	// Method for setting the initial state.
	static getInitialState( selectedPost, 
							selectedPostTypes, 
							selectedCategories, 
							selectedTags, 
							selectedTaxonomies,
							selectedTerms ) {
	  	return {
			//allPosts: [],
			//selectedPost: selectedPost,
			//thePost: {}, 
			allPostTypes: [],
			selectedPostTypes: selectedPostTypes,
			//thePostTypes: {},
			allCategories: [],
			selectedCategories: selectedCategories,
			//theCategories: {},
			allTags: [],
			selectedTags: selectedTags,
			//theTags: {},
			allTaxonomies: [],
			selectedTaxonomies: selectedTaxonomies,
			//theTaxonomies: {},
			allTerms: [],
			selectedTerms: selectedTerms,
			//theTerms: {},
			activeTab: '1',
	  	}
	}

	// Constructing our component. With super() we are setting everything to 'this'.
	// Now we can access the attributes with this.props.attributes
	constructor() {
		super( ...arguments )

		this.state = {
			termOptionsState: []
		}
		// Try to load previously selected post
		this.state = this.constructor.getInitialState( 
			this.props.attributes.selectedPost,
			this.props.attributes.selectedPostTypes,
			this.props.attributes.selectedCategories,
			this.props.attributes.selectedTags,
			this.props.attributes.selectedTaxonomies,
			this.props.attributes.selectedTerms
		)

		
		////console.log("== [MM] getInitialState this.state ==", this.state)

		// Bind so we can use 'this' inside the method
		//this.getPosts = this.getPosts.bind(this)
		////console.log(this.getPosts)
		
		// Load posts into state
		//this.getPosts()

		// Bind so we can use 'this' inside the method
		this.getPostTypes = this.getPostTypes.bind(this)
		// Load post types into state
		this.getPostTypes()

		// Bind so we can use 'this' inside the method
		this.getCategories = this.getCategories.bind(this)
		// Load categories into state
		this.getCategories()

		// Bind so we can use 'this' inside the method
		this.getTags = this.getTags.bind(this)
		// Load tags into state
		this.getTags()

		// Bind so we can use 'this' inside the method
		this.getTaxonomies = this.getTaxonomies.bind(this)

		// Load taxonomies into state
		this.getTaxonomies()

		
		this.getTerms = this.getTerms.bind(this)
		this.getPostsByTerm = this.getPostsByTerm.bind(this)
		
		// Bind all for this
		this.onChangePost = this.onChangePost.bind(this)
		this.onChangePostTypes = this.onChangePostTypes.bind(this)
		this.onChangeCategories = this.onChangeCategories.bind(this)
		this.onChangeTags = this.onChangeTags.bind(this)
		this.onChangeTaxonomies = this.onChangeTaxonomies.bind(this)
		this.onChangeTerms = this.onChangeTerms.bind(this)
		this.onChangeNumToShow = this.onChangeNumToShow.bind(this)
		this.onChangeOrderBy = this.onChangeOrderBy.bind(this)
		this.onChangeOrder = this.onChangeOrder.bind(this)
		this.onChangeExcludeIDs = this.onChangeExcludeIDs.bind(this)
		this.onChangeHideTitle = this.onChangeHideTitle.bind(this)
		this.onChangeHideDate = this.onChangeHideDate.bind(this)
		this.onChangeHideFeaturedMedia = this.onChangeHideFeaturedMedia.bind(this)
		this.onChangeHideExcerpt = this.onChangeHideExcerpt.bind(this)
		this.onChangeExcerptWordCount = this.onChangeExcerptWordCount.bind(this)
		this.onChangeHideCTA = this.onChangeHideCTA.bind(this)
		this.onChangeCTAContent = this.onChangeCTAContent.bind(this)
		this.onChangeColumnsToShow = this.onChangeColumnsToShow.bind(this)
		this.outputOneResult = this.outputOneResult.bind(this)
		this.toggleTabs = this.toggleTabs.bind(this)
	}

	componentDidMount(someValue) {
			// apiFetch( {
			// 	path: '/wp-json/wp/v2/' + tax.name
			// } ).then(
			// 	( allTermsList ) => {
			// 		allTermsList = [...allTermsPayload, [tax.name, tax.types, terms]]
			// 			this.setState( { allTermsList } );
			// 			console.log(allTermsList)
			// 	}
			// ).catch(
			// 	() => {
					
			// 	}
			// );

	}

	// componentWillMount(someValue) {
	// 	this.isStillMounted = true;
		
	// 	const hasTaxonomies = taxonomiesList || []
	// 	console.log(taxonomiesList)
	// 	let allTermsPayload = []
	// 	this.getTermsPayload = hasTaxonomies.forEach( (tax) => {
	// 		apiFetch( { path: '/wp-json/wp/v2/' + tax.name } ).then((terms) => {
	// 			if ( this.isStillMounted ) {
	// 				allTermsList = [...allTermsPayload, [tax.name, tax.types, terms]]
	// 				this.setState({ allTermsList })
	// 			}
	// 		})
	// 	})
	// }

	componentWillMount() {
		this.isStillMounted = true;
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	componentWillReceiveProps(nextProps) {
        // if(nextProps.value !== this.props.value){
        //     this.setState({count:nextProps.value})
		// }
		////console.log('componentWillReceiveProps:', nextProps)
    }

	/**
	 * Loading Posts
	 */
	getPosts() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/posts' } ).then( ( allPosts ) => {
				////console.log( allPosts )
				if( allPosts && this.state.selectedPost !== 0 ) {
					// If we have a selected Post, find that post and add it.
					const thePost = allPosts.find( ( item ) => { return item.id == this.state.selectedPost } )
					// This is the same as { thePost: thePost, allPosts: allPosts }
					this.setState( { thePost, allPosts }, function() {
						////console.log('== [MM] NEW STATE 1 ==', this.state)
					})
				} else {
					this.setState( { allPosts }, function() {
						////console.log('== [MM] NEW STATE 0 ==', this.state)
					})
				}
			})
		)
	}

	getPostTypes() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/types' } ).then( ( allPostTypes ) => {
				// don't allow media attachments or gutenberg blocks
				delete allPostTypes["attachment"]
				delete allPostTypes["wp_block"]
				////console.log('== [MM] allPostTypes ==', allPostTypes)
				if( allPostTypes && this.state.selectedPostTypes !== 0 ) {
					// //console.log('== [MM] this.state.selectedPostTypes ==', this.state.selectedPostTypes)

					// If we have a selected post type, find that post type and add it.
					const thePostTypes = {} // allPostTypes.find( ( item ) => { return item.id == this.state.selectedPostTypes } )
					
					// This is the same as { thePost: thePost, allPostTypes: allPostTypes }
					this.setState( { thePostTypes, allPostTypes }, function() {
						////console.log('== [MM] NEW STATE thePostTypes, allPostTypes ==', this.state)

						// TODO : 
						// get taxonomies from post types
						for (var key in this.state.allPostTypes) {
							// make sure key is not in "_prototype"
							if (this.state.allPostTypes.hasOwnProperty(key)) {
								////console.log("---")
								////console.log("key:", key)
								////console.log("allPostTypes[key]:", allPostTypes[key])
		
								let thisPostType = allPostTypes[key]
								let theseTaxonomies = this.state.allPostTypes[key]['taxonomies'] // does this sub-key always exist??? 
								////console.log("theseTaxonomies:", theseTaxonomies)

								//let thisTaxonomy = new Promise()
								for (var i = 0; i < theseTaxonomies.length; i++) {
									
									this.getTerms(theseTaxonomies[i])

									//let thisTerms = this.getPostsByTerm(thisPostType, theseTaxonomies[i], 'WHATCHA GONNA BE?')
									////console.log("thisTerms:", thisTerms)
								}
								////console.log("---")

								// get terms from thisTaxonomy
								// save thisTaxomony terms
								// then build out selectoptions
		
							}
						}
					})
					
				} else {
					this.setState( { allPostTypes }, function() {
						////console.log('== [MM] NEW STATE allPostTypes ==', this.state)
					})
				}

			})
		)
	}

	getCategories() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/categories' } ).then( ( allCategories ) => {
				////console.log('== [MM] allCategories ==')
				////console.log( allCategories )
				if( allCategories && this.state.selectedCategories !== 0 ) {
					// //console.log('== [MM] this.state.selectedCategories ==')
					// //console.log(this.state.selectedCategories)

					// If we have a selected category, find that category and add it.
					const theCategories = {} // allCategories.find( ( item ) => { return item.id == this.state.selectedCategories } )
					
					// This is the same as { theCategories: theCategories, allCategories: allCategories }
					this.setState( { theCategories, allCategories } )

				} else {
					this.setState( { allCategories } )
				}
			})
		)
	}

	getTags() {
		return ( 
			apiFetch( { path: '/wp-json/wp/v2/tags' } ).then( ( allTags ) => {
				////console.log('== [MM] allTags ==')
				////console.log( allTags )
				if( allTags && this.state.selectedTags !== 0 ) {
					// //console.log('== [MM] this.state.selectedTags ==')
					// //console.log(this.state.selectedTags)

					// If we have a selected tag, find that tag and add it.
					const theTags = {} // allTags.find( ( item ) => { return item.id == this.state.selectedTags } )
					
					// This is the same as { theTags: theTags, allTags: allTags }
					this.setState( { theTags, allTags } )

				} else {
					this.setState( { allTags } )
				}
			})
		)
	}

	getTaxonomies() {
		return (
			apiFetch( { path: '/wp-json/wp/v2/taxonomies'} ).then( ( allTaxonomies ) => {
				//console.log('== [MM] allTaxonomies ==', allTaxonomies)
				if( allTaxonomies && this.state.selectedTaxonomies !== 0 ) {
					// //console.log('== [MM] this.state.selectedTaxonomies ==')
					// //console.log(this.state.selectedTaxonomies)

					// If we have a selected tag, find that tag and add it.
					const theTaxonomies = {} // allTaxonomies.find( ( item ) => { return item.id == this.state.selectedTaxonomies } )
					
					// This is the same as { theTaxonomies: theTaxonomies, allTaxonomies: allTaxonomies }
					this.setState( { theTaxonomies, allTaxonomies }, function() {
						//console.log('== [MM] NEW STATE theTaxonomies, allTaxonomies ==')
						//console.log(this.state)
						// for (var i = 0; i < allTaxonomies.length; i++) {
						// 	this.getTerms(allTaxonomies[i])
						// }
						
					})

				} else {
					this.setState( { allTaxonomies }, function() {
						////console.log('== [MM] NEW STATE allTaxonomies ==')
						////console.log(this.state)
					})
				}
			})
		)
	}

	async getTerms(taxonomy) {
		// make up for WP renaming of taxonomy rest endpoints
		if ( taxonomy === 'category') {
			taxonomy = 'categories'
		} else if ( taxonomy === 'post_tag') {
			taxonomy = 'tags'
		}
		const fetchedTerms = await apiFetch( { path: '/wp-json/wp/v2/' + taxonomy } )
		////console.log("fetchedTerms:", fetchedTerms)

		let existingTerms = this.state.allTerms
		////console.log("existingTerms:", existingTerms)

		// check one-by-one if fetchedTerms exists already in state
		let newTerms = []
		let foundExistingTerm = false
		let findExistingTerm = -1
		for (var i = 0; i < fetchedTerms.length; i++) {
			//console.log("fetchedTerms[i]", fetchedTerms[i])
			//console.log("fetchedTerms[i]['id']", fetchedTerms[i]['id'])

			// findExistingTerm = existingTerms.find( ( item ) => { 
			// 	//console.log("item", item)
			// 	//console.log("fetchedTerms[i]['id']", fetchedTerms[i]['id'])
			// 	for (var j = 0; j < item.length; j++) {
			// 		if ( item[j]['id'] === fetchedTerms[i]['id']) {
			// 			//console.log("FOUND item[j]", item[j])
			// 			return true
			// 		}
			// 	}
			// 	//return item.id == fetchedTerms[i]['id']
			// } )
			for (var j = 0; j < existingTerms.length; j++) {
				////console.log("existingTerms[j]", existingTerms[j])
				for (var k = 0; k < existingTerms[j].length; k++) {
					if ( existingTerms[j]['id'] === fetchedTerms[i]['id']) {
						////console.log("FOUND existingTerms[j]['id']", existingTerms[j]['id'])
						foundExistingTerm = true
					}
				}
			}
			//findExistingTerm = this.search(fetchedTerms[i]['name'], existingTerms)
			//findExistingTerm = existingTerms.indexOf(fetchedTerms[i])
			// for(var t = 0; t < ???; t++)
			////console.log("foundExistingTerm:", foundExistingTerm)
			
			if ( !foundExistingTerm ) {
				newTerms.push(fetchedTerms[i])
			}
			////console.log("newTerms:", newTerms)
			foundExistingTerm = false

		}
		
		//existingTerms = [...existingTerms, ...newTerms]
		existingTerms.push(newTerms)
		////console.log("new existingTerms:", existingTerms)
		
		this.setState( { allTerms: existingTerms }, function() {
			//console.log('== [MM] NEW STATE allTerms ==', this.state.allTerms)
		})
	}

	getPostsByTerm(postType, taxonomy, term) {
		// make up for WP renaming of taxonomy rest endpoints
		if ( taxonomy === 'category') {
			taxonomy = 'categories'
		} else if ( taxonomy === 'post_tag') {
			taxonomy = 'tags'
		}
		// return promise
		return (
			// /wp-json/wp/v2/portfolio?portfolio-category='+term_id
			apiFetch( { path: '/wp-json/wp/v2/' + postType + '/' + taxonomy + '?' + term } ).then( ( response ) => {
				//console.log("response:", response)
			})
		)
	}
	
	search(nameKey, myArray){
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].name === nameKey) {
				return myArray[i];
			}
		}
	}

	extend(obj, src) {
		Object.keys(src).forEach(function(key) { obj[key] = src[key] })
		return obj
	}

	onChangePost(newSelectedPost) {
		////console.log("newSelectedPost:", newSelectedPost)

		// Find the post
		const thePost = this.state.allPosts.find( ( item ) => { return item.id == parseInt( newSelectedPost ) } )
		////console.log("thePost:", thePost)
		
		// Set the state
		////console.log("old selectedPost:", this.state.selectedPost)
		this.setState( { selectedPost: parseInt( newSelectedPost ), thePost } )
		////console.log("new selectedPost?", this.state.selectedPost) // not guaranteed, takes some time
		
		// Set the attributes
		this.props.setAttributes( {
			selectedPost: parseInt( newSelectedPost ),
			title: typeof thePost !== 'undefined' ? thePost.title.rendered : '',
			content: typeof thePost !== 'undefined' ? thePost.excerpt.rendered : '',
			link: typeof thePost !== 'undefined' ? thePost.link : '',
		} )
	}

	onChangePostTypes(newPostTypes) {
		////console.log("newPostTypes:", newPostTypes)
		
		// Find the post types?

		// Set the state
		this.setState( { selectedPostTypes: newPostTypes } )
		
		// Set the attributes
		this.props.setAttributes( { selectedPostTypes: newPostTypes } )

		// //console.log('== [MM] this.props.attributes ==')
		// //console.log(this.props.attributes)

		// this.forceUpdate()
		// this.setState({ state: this.state })
	}

	onChangeCategories(newCategories) {
		////console.log("newCategories:", newCategories)
		
		// Find the categories?

		// Set the state
		this.setState( { selectedCategories: newCategories } )
		
		// Set the attributes
		this.props.setAttributes( { selectedCategories: newCategories } )

		// //console.log('== [MM] this.props.attributes ==')
		// //console.log(this.props.attributes)
	}

	onChangeTags(newTags) {
		////console.log("newTags:", newTags)
		
		// Find the tags?

		// Set the state
		this.setState( { selectedTags: newTags} )
		
		// Set the attributes
		this.props.setAttributes( { selectedTags: newTags } )

		// //console.log('== [MM] this.props.attributes ==')
		// //console.log(this.props.attributes)
	}

	onChangeTaxonomies(newTaxonomies) {
		////console.log("newTaxonomies:", newTaxonomies)
		
		// Find the taxonomies?

		// Set the state
		this.setState( { selectedTaxonomies: newTaxonomies} )
		
		// Set the attributes
		this.props.setAttributes( { selectedTaxonomies: newTaxonomies } )

		// //console.log('== [MM] this.props.attributes ==')
		// //console.log(this.props.attributes)
	}

	onChangeTerms(newTerms) {
		////console.log("newTerms:", newTerms)
		
		// Find the terms?

		// Set the state
		this.setState( { selectedTerms: newTerms} )
		
		// Set the attributes
		this.props.setAttributes( { selectedTerms: newTerms } )

		//console.log('== [MM] this.props.attributes ==')
		//console.log(this.props.attributes)
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

	// display attributes
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

	onChangeColumnsToShow(newColumnsToShow) {
		this.props.setAttributes( { columnsToShow: newColumnsToShow } )
    }
    
    outputOneResult(item) {
		////console.log("item", item)
		////console.log("this.props.attributes", this.props.attributes)

		let thisDate = new Date(item.date)
		thisDate = this.formatDate(thisDate)

		let featuredMediaArray = []
		////console.log("featuredMediaArray", featuredMediaArray)
		let featuredMedia = ''
		try {
			featuredMediaArray = item._embedded['wp:featuredmedia']
			featuredMedia = featuredMediaArray['0'].source_url
			////console.log("featuredMedia", featuredMedia)
		} catch (e) {
			////console.log("e", e)
		}

        return (
			<Col>
				<Card>
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
							<CardText dangerouslySetInnerHTML={ { __html: this.truncateWords(item.excerpt.rendered,this.props.attributes.excerptWordCount) } } />
						</Display>
						<Display if={!this.props.attributes.hideCTA}>
							<Button dangerouslySetInnerHTML={ { __html: this.props.attributes.ctaContent } } />
						</Display>
					</CardBody>
				</Card>
			</Col>
        )
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

		let { allTermsNew } = this.props

		const hasTermsList = allTermsNew || []
		const allTermsOptions = hasTermsList.map(function(tax) {
			return {[tax.taxonomy]: tax.terms.map( (term) => { return { value: term.id, label: term.name } })}
		})
		console.log(allTermsOptions)

		//let outputPost = __( 'POST POST POST' )
		let outputPostTypes = __( 'TYPE TYPE TYPE' )
		let outputCategories = __( 'CAT CAT CAT' )
        let outputTags = __( 'TAG TAG TAG' )
        let outputTaxonomies = __( 'TAX TAX TAX' )
        let outputTerms = __( 'TRM TRM TRM' )
		let postOptions = [ { value: 0, label: __( '' ) } ]
		let postTypeOptions = [ { value: 0, label: __( '' ) } ]
		let categoryOptions = [ { value: 0, label: __( '' ) } ]
		let tagOptions = [ { value: 0, label: __( '' ) } ]
		let taxonomyOptions = [ { value: 0, label: __( '' ) } ]
		let termOptions = [ { value: 0, label: __( '' ) } ]

		// if this block is selected right now
		let isSelected = this.props.isSelected
        ////console.log(isSelected)


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
			////console.log("theLatest", theLatest)
		}

	

		if ( 'many' === 'many' ) {

			////console.log('many === many')
			
			outputPostTypes = __( 'Loading Post Types' )
			postTypeOptions = [ { value: 0, label: __( 'Choose Post Type' ) } ]
			categoryOptions = [] // [ { value: 0, label: __( 'Choose Categories' ) } ]
			tagOptions = [] // [ { value: 0, label: __( 'Choose Tags' ) } ]
			taxonomyOptions = [] // [ { value: 0, label: __( 'Choose Taxonomies' ) } ]
			termOptions = [] // [ { value: 0, label: __( 'Choose Terms' ) } ]

			////console.log("== [MM] render this.state.allPostTypes ==")
			////console.log(this.state.allPostTypes)
			////console.log(Object.keys(this.state.allPostTypes).length)
			
			//const countKeys = Object.keys(this.state.allPostTypes).length

			// if we have stored any post types
			if ( Object.keys(this.state.allPostTypes).length > 0 ) {
				
				const loading = __( 'We have %d post types. Choose one or many.' )
				outputPostTypes = loading.replace( '%d', Object.keys(this.state.allPostTypes).length )
				
				// put stored post types in the "postTypeOptions" array
				for (var thePostType in this.state.allPostTypes) {
					////console.log(this.state.allPostTypes[thePostType])
					// //console.log(index)
					postTypeOptions.push( { value: this.state.allPostTypes[thePostType].slug, label: this.state.allPostTypes[thePostType].name } )
				}
				
			} else {
				outputPostTypes = __( 'No post types found. Please create some first?' )
			}

			// if we have stored any categories
			if ( Object.keys(this.state.allCategories).length > 0 ) {
				
				const loading = __( 'We have %d categories. Choose one or many.' )
				outputCategories = loading.replace( '%d', Object.keys(this.state.allCategories).length )
				
				// put stored categories in the "categoryOptions" array
				for (var theCategory in this.state.allCategories) {
					////console.log(this.state.allCategories[theCategory])
					// //console.log(index)
					categoryOptions.push( { 
                        value: this.state.allCategories[theCategory].id, 
                        label: this.state.allCategories[theCategory].name, 
                        slug: this.state.allCategories[theCategory].slug
                    } )
				}
				
			} else {
				outputCategories = __( 'No categories found. Please create some first?' )
			}

			// if we have stored any tags
			if ( Object.keys(this.state.allTags).length > 0 ) {
				
				const loading = __( 'We have %d tags. Choose one or many.' )
				outputTags = loading.replace( '%d', Object.keys(this.state.allTags).length )
				
				// put stored tags in the "tagOptions" array
				for (var theTag in this.state.allTags) {
					// //console.log(this.state.allTags[theTag])
					// //console.log(index)
					tagOptions.push( { 
                        value: this.state.allTags[theTag].id, 
                        label: this.state.allTags[theTag].name, 
                        slug: this.state.allTags[theTag].slug 
                    } )
				}
				
			} else {
				outputTags = __( 'No tags found. Please create some first?' )
			}

			// if we have stored any taxonomies
			if ( Object.keys(this.state.allTaxonomies).length > 0 ) {
				
				const loading = __( 'We have %d taxonomies. Choose one or many.' )
				outputTaxonomies = loading.replace( '%d', Object.keys(this.state.allTaxonomies).length )
				
				// put stored taxonomies in the "taxonomyOptions" array
				for (var theTaxonomy in this.state.allTaxonomies) {
					// //console.log(this.state.allTaxonomies[theTaxonomy])
					// //console.log(index)
					taxonomyOptions.push( { 
                        value: this.state.allTaxonomies[theTaxonomy].id, 
                        label: this.state.allTaxonomies[theTaxonomy].name, 
                        slug: this.state.allTaxonomies[theTaxonomy].slug 
                    } )
				}
				
			} else {
				outputTaxonomies = __( 'No taxonomies found. Please create some first?' )
			}

			// if we have stored any terms
			if ( Object.keys(this.state.allTerms).length > 0 ) {
				
				const loading = __( 'We have %d terms. Choose one or many.' )
				outputTerms = loading.replace( '%d', Object.keys(this.state.allTerms).length )
				
				// put stored terms in the "termOptions" array
				for (var theTerm in this.state.allTerms) {
					//console.log("this.state.allTerms[theTerm]", this.state.allTerms[theTerm])
					for (var k = 0; k < theTerm.length; k++) {
						if (typeof this.state.allTerms[theTerm][k] !== 'undefined') {
							//console.log("this.state.allTerms[theTerm][k].id", this.state.allTerms[theTerm][k].id)
							//console.log("this.state.allTerms[theTerm][k].name", this.state.allTerms[theTerm][k].name)
							//console.log("this.state.allTerms[theTerm][k].slug", this.state.allTerms[theTerm][k].slug)
							// //console.log(index)
							termOptions.push( { 
								value: this.state.allTerms[theTerm][k].id, 
								label: this.state.allTerms[theTerm][k].name, 
								slug: this.state.allTerms[theTerm][k].slug
							} )
						}
					}
				}
				
			} else {
				outputTerms = __( 'No terms found. Please create some first?' )
			}
			
			////console.log('== [MM] this.props.attributes ==')
			////console.log('== ==')
			////console.log(this.props.attributes)
			////console.log('== ==')

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
			if ( typeof this.state.selectedCategories !== 'undefined' && this.state.selectedCategories.length > 0 ) {
				outputCategories = (
					<div className="categories">
						Selected Category IDs: { this.state.selectedCategories.join(", ") }
					</div>
				)
				this.props.className += ' has-categories'
			} else {
				this.props.className += ' no-categories'
			}

			// if we have anything in the object
			if ( typeof this.state.selectedTags !== 'undefined' && this.state.selectedTags.length > 0 ) {
				outputTags = (
					<div className="tags">
						Selected Tag IDs: { this.state.selectedTags.join(", ") }
					</div>
				)
				this.props.className += ' has-tags'
			} else {
				this.props.className += ' no-tags'
			}

			// if we have anything in the object
			if ( typeof this.state.selectedTaxonomies !== 'undefined' && this.state.selectedTaxonomies.length > 0 ) {
				outputTaxonomies = (
					<div className="taxonomies">
						Selected Taxonomy IDs: { this.state.selectedTaxonomies.join(", ") }
					</div>
				)
				this.props.className += ' has-taxonomies'
			} else {
				this.props.className += ' no-taxonomies'
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

		} // end if 'many' === 'many'

		// return the render!
		return [
			isSelected && ( 
				1 === 1
			), 
			<div className={this.props.className}>
			
				{/* <div className="row">
					{outputPost}
				</div> */}

				<div className="row">
					{outputPostTypes}
				</div>

				<div className="row">
					{outputCategories}
				</div>

				<div className="row">
					{outputTags}
				</div>

				{/* <div className="row">
					{outputTaxonomies}
				</div> */}

				<div className="row">
					{outputTerms}
				</div>

                <div className="row">
					<Container>
						<Row>
						{ 
							hasLatest ? (

								theLatest.map( (item, i) => {
									////console.log("this.outputOneResult(item):", this.outputOneResult(item))
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
							{/* <PanelBody>
								<PanelRow>
									<SelectControl 
										onChange={ this.onChangePost } 
										value={ this.props.attributes.selectedPost } 
										label={ __( 'Select a Post' ) } 
										options={ postOptions } 
									/>
								</PanelRow>
							</PanelBody> */}
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
								<Display key={Math.random} if={this.props.attributes.selectedPostTypes === 'post'}>
									<PanelRow>
										<SelectControl 
											onChange={ this.onChangeCategories } 
											value={ this.props.attributes.selectedCategories } 
											label={ __( 'Categories' ) } 
											options={ categoryOptions } 
											multiple={ true }
										/>
									</PanelRow>
									<PanelRow>
										<SelectControl 
											onChange={ this.onChangeTags } 
											value={ this.props.attributes.selectedTags } 
											label={ __( 'Tags' ) } 
											options={ tagOptions } 
											multiple={ true }
										/>
									</PanelRow>
								</Display>
								<Display key={Math.random} if={
									this.props.attributes.selectedPostTypes !== '' 
									&& this.props.attributes.selectedPostTypes !== 'post' 
									&& this.props.attributes.selectedPostTypes !== 'page'}>
									<PanelRow>
										{/* <SelectControl 
											onChange={ this.onChangeTaxonomies } 
											value={ this.props.attributes.selectedTaxonomies } 
											label={ __( 'Taxonomies' ) } 
											options={ taxonomyOptions } 
											multiple={ true }
										/> */}
										<SelectControl 
											onChange={ this.onChangeTerms } 
											value={ this.props.attributes.selectedTerms } 
											label={ __( 'Terms' ) } 
											options={ termOptions } 
											multiple={ true }
										/>
									</PanelRow>
								</Display>
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
										label="Columns To Show"
										type="number"
										value={ this.props.attributes.columnsToShow }
										onChange={ this.onChangeColumnsToShow }
									/>
								</PanelRow>
							</PanelBody>
						</TabPane>
					</TabContent>
				</InspectorControls>



			</div>
		]
		//return ( 'Load Post Placeholder' )
	}

} // end class


export default withSelect( ( select, props ) => {
    
    ////console.log("== [MM] select ==")
    ////console.log(select)
    ////console.log("== [MM] props ==")
    ////console.log(props)
    
	const { 
		allTerms,
		selectedPostTypes, 
		selectedCategories, 
		selectedTags, 
		selectedTaxonomies,
		selectedTerms, 
		numToShow, 
		orderBy, 
		order,
		excludeIDs
	} = props.attributes
	
	const _embed = true
	const urlParams = new URLSearchParams(window.location.search)
	var excludeThese = urlParams.get('post')
	excludeThese = excludeIDs !== '' ? excludeThese + ',' + excludeIDs : excludeThese
	////console.log("excludeThese", excludeThese)
	////console.log("excludeIDs", excludeIDs)

	const { getEntityRecords, getTaxonomies } = select( 'core' )
	////console.log("getEntityRecords", getEntityRecords)
	////console.log("order", order)

	var latestPostsQuery = {}
	var theLatestPosts = []
	//var theLatestPages = [] // temp
	var theLatest = []
	
	////console.log("allTerms", allTerms)
	////console.log("selectedTerms", selectedTerms)
	var taxQuery = []
	for(var j; j < taxQuery.length; j++) {
		//this.state.selectedTerms
	}
	var selectedTermsTest = {
		'practice-category': ['25']
	}

	////console.log("selectedPostTypes", selectedPostTypes)
	////console.log("selectedPostTypes.length", selectedPostTypes.length)

	//for (var i = 0; i < selectedPostTypes.length; i++) {
		latestPostsQuery = pickBy( {
			categories: selectedCategories,
			tags: selectedTags,
			selectedTermsTest,
			per_page: numToShow,
			orderby: orderBy,
			order: order,
			_embed,
			exclude: excludeThese
		}, ( value ) => ! isUndefined( value ) && value !== '')
		////console.log("== [MM] latestPostsQuery ==", latestPostsQuery)

		// get and set data, then merge/spread into a payload
		let thisPostType = selectedPostTypes // [i]
		theLatestPosts = getEntityRecords( 'postType', selectedPostTypes, latestPostsQuery )
		if ( theLatestPosts == null ) { theLatestPosts = [] }
		////console.log("selectedPostTypes", selectedPostTypes) // [i]
		////console.log("== [MM] theLatestPosts ==", theLatestPosts)

		// merge arrays using spread operator (es6)
		theLatest = [...theLatest, ...theLatestPosts]
		////console.log("== [MM] theLatest ==", theLatest)
	//}
	
	/* Build array of taxonomies and their terms */
	const taxonomiesList = getTaxonomies()
	const hasTaxonomiesList = taxonomiesList || []
	
	let allTermsNew = [];
	let allTermsOptions = []
	hasTaxonomiesList.forEach( async (tax) => {
		let taxName = tax.rest_base;
		await apiFetch( { path: '/wp-json/wp/v2/'+ taxName } ).then( (terms) =>  {
			allTermsNew.push( { 'taxonomy': tax.name, 'rest': taxName, 'types': tax.types, 'terms': terms } ) 
		})
	})
	
	

    return {
		latestPayload: theLatest,
		taxonomiesList,
		allTermsNew,
		//allTermsOptions
	}
} )( myQueryBuilderComponent )