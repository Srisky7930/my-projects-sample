import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import Projects from '../Projects'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Home extends Component {
  state = {
    selectList: categoriesList,
    projectList: [],
    category: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsDetails()
  }

  getProjectsDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const fetchedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        projectList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSelect = event => {
    this.setState(
      {
        category: event.target.value,
      },
      this.getProjectsDetails,
    )
  }

  getSuccessView = () => {
    const {selectList, projectList, category} = this.state
    return (
      <div className="home-container">
        <div className="project-selector">
          <select
            className="options-list"
            value={category}
            onChange={this.onChangeSelect}
          >
            {selectList.map(each => (
              <option className="options" value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        <div className="projects-container">
          <ul className="projects-list">
            {projectList.map(each => (
              <Projects each={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getLoaderView = () => (
    <div className="loader-spinner" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  onClickButton = () => {
    this.getProjectsDetails()
  }

  getFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1> Oops! Something Went Wrong </h1>
      <p> We cannot seem to find the page you are looking for </p>
      <button type="button" onClick={this.onClickButton}>
        Retry
      </button>
    </div>
  )

  renderProjectsDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.inProgress:
        return this.getLoaderView()
      case apiStatusConstants.failure:
        return this.getFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProjectsDetails()}
      </>
    )
  }
}

export default Home
