import './index.css'

const Projects = props => {
  const {each} = props
  const {imageUrl, name} = each
  return (
    <li className="project-details">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name"> {name} </p>
    </li>
  )
}

export default Projects
