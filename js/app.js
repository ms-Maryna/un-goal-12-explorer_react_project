/* Copyright Derek O'Reilly, Dundalk Institute of Technology (DkIT), Dundalk, Co. Louth, Ireland. */
"use strict"

const ASCENDING = 1

/* ---------- NavigationBar ---------- */
class NavigationBar extends React.Component {
  render() {
    return (
      <div id="navBar">
        <span id="appTitle">United Nations sustainability goal 12</span>

        <div id="navActions">
          {/* Removed Show Table */}
          <input type="button" value="Add Example"   onClick={this.props.onAddExample}/>
          <input type="button" value="Manage Tags"   onClick={this.props.onManageTags}/>
        </div>

        <div id="navFilters">
          {/* search */}
          <input
            type="text"
            placeholder="Search title/description/tags"
            value={this.props.search}
            onChange={this.props.onSearchChange}
          />
          
          

          {/* target */}
          <select value={this.props.selectedTarget} onChange={this.props.onTargetsChange}>
            {(this.props.targets || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* favourite */}
          <select value={this.props.favourite} onChange={this.props.onFavouriteChange}>
            <option value="all">All favourites</option>
            <option value="yes">Favourites only</option>
            <option value="no">Not favourites</option>
          </select>

          {/* rating */}
          <select value={this.props.minRating} onChange={this.props.onMinRatingChange}>
            <option value="0">All ratings</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>

          {/* tag */}
          <select value={this.props.tagFilter} onChange={this.props.onTagFilterChange}>
            <option value="all">All tags</option>
            {(this.props.tagsList || []).map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>
      </div>
    )
  }
}
/* ---------- Modal Component ---------- */
class Modal extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        // if nothing selected, do not render
        if (!this.props.example) return null

        return(
           <div className="modal">
               <div className="modal_content">
                   {/* Title */}
                   <h2>{this.props.example.title}</h2>

                   {/* Favourite and rating */}
                   <p><b>Favourite:</b> {this.props.example.favourite}</p>
                   <p><b>Rating:</b> {this.props.example.rating}</p>

                   {/* Tags */}
                   <div>
                     <b>Tags:</b>
                     <ul>
                       {(this.props.example.tags || []).map(tag => 
                           <li key={tag}>{tag}</li>
                       )}
                     </ul>
                   </div>

                   {/* Description */}
                   <p><b>Description:</b> {this.props.example.description}</p>

                   {/* Images */}
                   {this.props.example.images && this.props.example.images.length > 0 && (
                       <div>
                           <b>Images:</b>
                           <ul>
                               {this.props.example.images.map((img, index) =>
                                   <li key={index}><img className="modalImage" src={img} alt="example"/> </li>
                               )}
                           </ul>
                       </div>
                   )}

                   {/* Close button */}
                   <input type="button" value="Close" onClick={this.props.onClose}/>
               </div>
           </div>
        )
    }
}

/* ---------- ConfirmDeleteModal Component ---------- */

class ConfirmDeleteModal extends React.Component
{
  constructor(props)
  {
    super(props)
  }

  render()
  {
    // If not visible, render nothing
    if (!this.props.show) return null

    return (
      <div className="modal">
        <div className="modal-content">
          <p>Are you sure you want to delete this item?</p>

          {/* Confirm and cancel buttons */}
          <div className="modal-buttons">
            <input
              type="button"
              value="Confirm"
              className="btn-confirm"
              onClick={this.props.onConfirm}
            />
            <input
              type="button"
              value="Cancel"
              className="btn-cancel"
              onClick={this.props.onCancel}
            />
          </div>
        </div>
      </div>
    )
  }
}


/* ---------- DropDownTargetsList Component ---------- */
/* Simple dropdown list to select one Target number */

class DropDownTargetsList extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(
            <select onChange={this.props.handleTargetsChange}>
                {/* Render one <option> for each Target */}
                {this.props.targets.map(target => 
                    <option key={target} value={target}>{target}</option>
                )}
            </select>
        )
    }
}


DropDownTargetsList.propTypes = {
    targets: PropTypes.array,
    handleTargetsChange: PropTypes.func
}



/* ---------- Table Component ---------- */
/* Displays examples in a sortable table (Number, title, rating) */

class ExamplesTable extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {
      examples: props.examples,
      sortDirection: ASCENDING,
      sortColumn: "title"
    }
  }

  componentDidMount()
  {
    // Default sort by title when loaded
    (this.props.examples || []).sort((a, b) => a["title"] < b["title"] ? -1 : 1)
    this.setState({ sortColumn: "title" })
  }

  static getDerivedStateFromProps(props, state)
  {
    // Update table when parent data changes
    if(state.examples !== props.examples)
    {
      const sortColumn = "title"
      let sortDirection = state.sortDirection

      if(state.sortColumn === sortColumn)
      {
        sortDirection = -sortDirection
      }
      else
      {
        sortDirection = ASCENDING
      }

      (props.examples || []).sort(
        (a,b) => a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection
      )

      return { examples: props.examples, sortDirection: ASCENDING, sortColumn: "title" }
    }
    return null
  }

  handleHeaderClick = (e) =>
  {
    const sortColumn = e.currentTarget.id   
    let sortDirection = this.state.sortDirection

    // Toggle direction if same column clicked
    if(this.state.sortColumn === sortColumn)
    {
      sortDirection = -sortDirection
    }
    else
    {
      sortDirection = ASCENDING
    }

    // Sort by selected column
    ;(this.props.examples || []).sort(
      (a,b) => a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection
    )

    this.setState({ sortDirection: sortDirection, sortColumn: sortColumn })
  }

  render()
  {
    return(
      <table>
        <thead>
          <tr>
            {/* Always show both arrows; bold for active sort */}
            <th id="_target" onClick={this.handleHeaderClick}>
              Number{" "}
              {this.state.sortColumn === "_target" && this.state.sortDirection === ASCENDING ? <b>▲</b> : "▲"}
              {this.state.sortColumn === "_target" && this.state.sortDirection === -ASCENDING ? <b>▼</b> : "▼"}
            </th>

            <th id="title" onClick={this.handleHeaderClick}>
              Title{" "}
              {this.state.sortColumn === "title" && this.state.sortDirection === ASCENDING ? <b>▲</b> : "▲"}
              {this.state.sortColumn === "title" && this.state.sortDirection === -ASCENDING ? <b>▼</b> : "▼"}
            </th>

            <th>Description</th>

            <th id="rating" onClick={this.handleHeaderClick}>
              Rating{" "}
              {this.state.sortColumn === "rating" && this.state.sortDirection === ASCENDING ? <b>▲</b> : "▲"}
              {this.state.sortColumn === "rating" && this.state.sortDirection === -ASCENDING ? <b>▼</b> : "▼"}
            </th>

            <th>Favourite</th>
            <th>Tags</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {(this.props.examples || []).map(ex =>
            <tr key={ex._id}>
              <td>{ex._target}</td>
              <td onClick={() => this.props.onSelectExample(ex)}>{ex.title}</td>
              <td>{ex.description}</td>
              <td>{ex.rating}</td>

              
              <td>{ex.favourite === "yes" ? "❤️" : "🤍"}</td>

              <td>
                <ul>
                  {(ex.tags || []).map(t => <li key={t}>{t}</li>)}
                </ul>
              </td>

              <td>
                {(ex.images || []).map((u,i) => <img key={i} src={u} alt="" className="img-thumb"/>)}
              </td>

              <td>
                {/* input buttons */}
                <input type="button" value="Edit" onClick={() => this.props.onEdit(ex)} />
                <input type="button" value="Delete" onClick={() => this.props.onDelete(ex)} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}

ExamplesTable.propTypes = {
  examples: PropTypes.array
  }


/* ---------- ExampleForm (add one example) ---------- */
class ExampleForm extends React.Component {
  constructor(props) {
    super(props)
    // If editing: use given example; if adding: start with empty defaults
    const ex = props.example || {}

    this.state = {
      _id:        ex._id || null,
      _target:    ex._target || "",
      title:      ex.title || "",
      description:ex.description || "",
      images:     ex.images || [],
      newImageUrl:"",
      tags:       ex.tags || [],
      favourite:  ex.favourite || "no",
      rating:     ex.rating || 0
    }
  }

  // --- handlers ---
  onTargetChange       = (e) => this.setState({ _target: e.target.value })
  onTitleChange        = (e) => this.setState({ title: e.target.value })
  onDescriptionChange  = (e) => this.setState({ description: e.target.value })
  onNewImageUrlChange  = (e) => this.setState({ newImageUrl: e.target.value })
  onFavouriteChange    = (e) => this.setState({ favourite: e.target.value })
  onRatingChange       = (e) => {
    const v = parseInt(e.target.value, 10)
    this.setState({ rating: isNaN(v) ? 0 : v })
  }

  // Submit the whole example up to parent
  onSubmit = (e) => {
    e.preventDefault()
    const example = {
      _id: this.state._id,
      _target: this.state._target,
      title: this.state.title,
      description: this.state.description,
      images: this.state.images,
      tags: this.state.tags,
      favourite: this.state.favourite,
      rating: this.state.rating
    }
    this.props.onSave(example)
  }

  // --- images: copy array manually; ---
  addImage = () => {
    if (this.state.newImageUrl !== "") {
      const cur = this.state.images || []
      const next = []
      for (let i = 0; i < cur.length; i++) { next[i] = cur[i] }
      next[next.length] = this.state.newImageUrl
      this.setState({ images: next, newImageUrl: "" })
    }
  }

  // Remove image by index
  deleteImage = (index) => {
    const next = (this.state.images || []).filter((u, i) => i !== index)
    this.setState({ images: next })
  }

  // Toggle tag: if present -> remove; if absent -> add 
  toggleTag = (tag) => {
    const now = this.state.tags || []
    let found = false
    const next = []
    for (let i = 0; i < now.length; i++) {
      if (now[i] === tag) { found = true } else { next[next.length] = now[i] }
    }
    if (!found) { next[next.length] = tag }
    this.setState({ tags: next })
  }

  render() {
    return (
      <form noValidate={true} onSubmit={this.onSubmit} className="example-form">
        {/* Target number */}
        <div className="form-group">
          <label>Target Number</label>
          <select value={this.state._target} onChange={this.onTargetChange} className="form-control">
            <option value="">Select Target</option>
            {(this.props.targets || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={this.state.title} onChange={this.onTitleChange} className="form-control"/>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea value={this.state.description} onChange={this.onDescriptionChange} className="form-control" />
        </div>

        {/* Image URLs */}
        <div className="form-group">
          <label>Image URLs</label>
          <div className="images-edit">
            <input type="text"
                   value={this.state.newImageUrl}
                   onChange={this.onNewImageUrlChange}
                   className="form-control"
                   placeholder="https://…" />
            <button type="button" onClick={this.addImage}>Add Image URL</button>
          </div>

          <ul className="images-list">
            {(this.state.images || []).map((url, i) =>
              <li key={i}>
<img className="img-thumb" src={url} alt="preview"
                     onError={(e)=>e.target.style.display="none"} />
                <button type="button" onClick={() => this.deleteImage(i)}>Delete</button>
              </li>
            )}
          </ul>
        </div>

        {/* Tags  */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-choices">
            {(this.props.tags || []).map(tag =>
              <label key={tag} className="tag-choice">
                <input
                  type="checkbox"
                  checked={(this.state.tags || []).indexOf(tag) !== -1}
                  onChange={() => this.toggleTag(tag)}
                />
                <span>{tag}</span>
              </label>
            )}
          </div>
        </div>

        {/* Favourite */}
        <div className="form-group">
          <label>Favourite</label>
          <select value={this.state.favourite} onChange={this.onFavouriteChange} className="form-control">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>

        {/* Rating */}
        <div className="form-group">
          <label>Rating (0–5)</label>
          <input type="number" min="0" max="5" value={this.state.rating} onChange={this.onRatingChange} className="form-control" />
        </div>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={this.props.onCancel}>Cancel</button>
        </div>
      </form>
    )
  }
}


/* ---------- TagsManager Component ---------- */
/* Manages the list of allowed tags:
   - Add a new tag
   - Rename an existing tag
   - Delete a tag everywhere
*/
class TagsManager extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {
      newTag: "",        // text for adding
      selectedTag: "",   // current tag selected in <select>
      renameTo: ""       // new name when renaming
    }
  }

  /* ---- field handlers  ---- */
  onNewTagChange = (e) => { this.setState({ newTag: e.target.value }) }
  onSelectedTagChange = (e) => { this.setState({ selectedTag: e.target.value }) }
  onRenameToChange = (e) => { this.setState({ renameTo: e.target.value }) }

  /* ---- button click handlers ---- */
  onAddTagClick = () =>
  {
    if (this.state.newTag !== "")
    {
      this.props.onAddTag(this.state.newTag)
      this.setState({ newTag: "" })
    }
  }

  onRenameTagClick = () =>
  {
    if (this.state.selectedTag !== "" && this.state.renameTo !== "")
    {
      this.props.onRenameTag(this.state.selectedTag, this.state.renameTo)
      this.setState({ renameTo: "" })
    }
  }

  onDeleteTagClick = () =>
  {
    if (this.state.selectedTag !== "")
    {
      this.props.onDeleteTag(this.state.selectedTag)
      this.setState({ selectedTag: "" })
    }
  }

  render()
  {
    return(
      <div id="tagsManager">
        <h3>Tags Manager</h3>

        {/* simple list preview */}
        <ul>
          {(this.props.tags || []).map(t => <li key={t}>{t}</li>)}
        </ul>

        {/* add */}
        <div className="tm-row">
          <input
            name="newTag"
            value={this.state.newTag}
            onChange={this.onNewTagChange}
            placeholder="New tag"
          />
          <input type="button" value="Add Tag" onClick={this.onAddTagClick}/>
        </div>

        {/* rename/delete */}
        <div className="tm-row">
          <select
            name="selectedTag"
            value={this.state.selectedTag}
            onChange={this.onSelectedTagChange}
          >
            <option value="">Select tag</option>
            {(this.props.tags || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <input
            name="renameTo"
            value={this.state.renameTo}
            onChange={this.onRenameToChange}
            placeholder="Rename to"
          />
          <input type="button" value="Rename" onClick={this.onRenameTagClick}/>
          <input type="button" value="Delete" onClick={this.onDeleteTagClick}/>
        </div>
      </div>
    )
  }
}

/* ---------- ExamplesCards (card view) ---------- */
class ExamplesCards extends React.Component
{
  render()
  {
    return (
      <div id="examplesCards">
        {(this.props.examples || []).map(ex =>
          <div key={ex._id} className="exCard">
            <div className="exHeader">
              <span className="exNumber">{ex._target}</span>
              <span className="exTitle" onClick={() => this.props.onSelectExample(ex)}>{ex.title}</span>
            </div>

            <div className="exBody">
              <div className="exRow"><b>Rating:</b> {ex.rating}</div>
              <div className="exRow"><b>Favourite:</b> {ex.favourite === "yes" ? "❤️" : "🤍"}</div>
              <div className="exRow"><b>Tags:</b> {(ex.tags || []).join(", ")}</div>
              <div className="exRow"><b>Description:</b> {ex.description}</div>

              {(ex.images && ex.images.length > 0) ?
                <div className="exImages">
                  {ex.images.map((url, i) =>
                    <img key={i} src={url} alt="" className="img-thumb"/>
                  )}
                </div>
              : null}
            </div>

            <div className="exActions">
              <input type="button" value="Edit"   onClick={() => this.props.onEdit(ex)}/>
              <input type="button" value="Delete" onClick={() => this.props.onDelete(ex)}/>
            </div>
          </div>
        )}
      </div>
    )
  }
}













/* ---------- Main Component SustainableGoalsApp ---------- */

class SustainableGoalsApp extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            targets: ["All Targets"],
            tagsList: [],
            selectedTarget: "All Targets",
            search: "",
            favourite: "all",
            minRating: "0",
            tagFilter: "all",
            selectedExample: null,
            view: "table",
            exampleToEdit: null,
            exampleToDelete: null,
            nextId:1
        }
    }

   
    
    componentDidMount() {
        fetch("json/un_sustainability_goal_12.json")
    .then(response => response.json())
    .then(raw => {
      let nextId = 1
      const tagsSet = new Set()

      // build new targets -> new examples 
      const targets = ((raw.goal && raw.goal.targets) ? raw.goal.targets : []).map(t => {
        const examples = (t.examples || []).map(ex => {
          const tags = ex.tags || []
          // collect tags
          for (let i = 0; i < tags.length; i++) { tagsSet.add(tags[i]) }

          return {
            _id: nextId++,
            title: ex.title || "",
            description: ex.description || "",
            images: ex.images || [],
            tags: tags,
            favourite: (Math.random() < 0.5) ? "yes" : "no",
            rating: Math.floor(Math.random() * 6)
          }
        })

        return { number: t.number, title: t.title, examples: examples }
      })

      // keep the same top-level shape your app expects
      const data = { goal: { targets: targets } }

      const targetsList = ["All Targets"].concat(targets.map(t => t.number))

      this.setState({
        data: data,
        targets: targetsList,
        tagsList: Array.from(tagsSet),
        next: nextId
      })
    })
}

 getFilteredExamples() {
        const examplesList = []
        const q = (this.state.search || "").toLowerCase()
        const mr = parseInt(this.state.minRating, 10) || 0

        if (!this.state.data.goal) {
            return examplesList
        }

        for (const t of this.state.data.goal.targets) {
            if (this.state.selectedTarget !== "All Targets" && t.number !== this.state.selectedTarget) {
                continue
            }
            for (const ex of t.examples) {
                const title = (ex.title || "").toLowerCase()
                const desc  = (ex.description || "").toLowerCase()
                let tagMatch = false
                for (const tag of ex.tags) {
                    if (tag.toLowerCase().includes(q)) {
                        tagMatch = true
                        break
                    }
                }

                if ((q === "") || title.includes(q) || desc.includes(q) || tagMatch) {
                    if (this.state.favourite === "all" || ex.favourite === this.state.favourite) {
                        if (ex.rating >= mr) {
                            if (this.state.tagFilter !== "all") {
  const tags = ex.tags || []
  if (tags.indexOf(this.state.tagFilter) === -1) {
    continue
  }
}
examplesList.push({ ...ex, _target: t.number })
                        }
                    }
                }
            }
        }

        examplesList.sort((a, b) => a.title < b.title ? -1 : 1)
        return examplesList
    }
    
    /* ---------- Handlers ---------- */
handleSearchChange    = e => { this.setState({ search: e.target.value }) }
handleTargetsChange   = e => { this.setState({ selectedTarget: e.target.value }) }
handleFavouriteChange = e => { this.setState({ favourite: e.target.value }) }
handleMinRatingChange = e => { this.setState({ minRating: e.target.value }) }
handleTagFilterChange = e => { this.setState({ tagFilter: e.target.value }) }

/* Add */
handleAddExample = (example) => {
  const newItem = {
    _id: this.state.nextId,
    _target: example._target,
    title: example.title,
    description: example.description,
    images: example.images || [],
    tags: example.tags || [],
    favourite: example.favourite,
    rating: example.rating
  }

  const targets0 = (this.state.data && this.state.data.goal && this.state.data.goal.targets) ? this.state.data.goal.targets : []

  
  const targets1 = targets0.map(t => {
    const src = t.examples || []
    const dst = []
    for (let i = 0; i < src.length; i++) { dst[i] = src[i] }
    if (t.number === newItem._target) { dst[dst.length] = newItem }
    return { number: t.number, title: t.title, examples: dst }
  })

  this.setState(prev => ({
    data: { goal: { ...prev.data.goal, targets: targets1 } },
    view: "table",
    nextId: prev.nextId + 1
  }))
}

/* Update */
handleUpdateExample = (updated) => {
  const targets = (this.state.data && this.state.data.goal && this.state.data.goal.targets) ? this.state.data.goal.targets : []
  const newTargets = targets.map(t => {
    const src = t.examples || []
    const dst = []
    for (let i = 0; i < src.length; i++) {
      const ex = src[i]
      dst[i] = (ex._id === updated._id) ? { ...updated, _target: t.number } : ex
    }
    return { number: t.number, title: t.title, examples: dst }
  })
  this.setState(prev => ({
    data: { goal: { ...prev.data.goal, targets: newTargets } },
    view: "table",
    exampleToEdit: null
  }))
}

/* Delete confirm  */
handleShowDeleteConfirm = (example) => {
  this.setState({ view: "confirm-delete", exampleToDelete: example })
}
handleConfirmDelete = () => {
  const id = this.state.exampleToDelete && this.state.exampleToDelete._id
  const targets = (this.state.data && this.state.data.goal && this.state.data.goal.targets) ? this.state.data.goal.targets : []
  const newTargets = targets.map(t => ({
    number: t.number,
    title: t.title,
    examples: (t.examples || []).filter(ex => ex._id !== id)
  }))
  this.setState(prev => ({
    data: { goal: { ...prev.data.goal, targets: newTargets } },
    view: "table",
    exampleToDelete: null
  }))
}

  
    showAddForm = () => {
        this.setState({ view: "add" })
    }

    showEditForm = example => {
        this.setState({ view: "edit", exampleToEdit: example })
    }

    showTagsManager = () => {
        this.setState({ view: "tags" })
    }

    showDeleteConfirm = example => {
        this.setState({ view: "confirm-delete", exampleToDelete: example })
    }

    showTable = () => {
        this.setState({ view: "table", exampleToEdit: null, exampleToDelete: null })
    }
/* ---------- Tags handlers ---------- */

/* Add new tag to tagsList (if it does not already exist) */
handleAddTag = (newTag) => {
  if (!newTag) {
    return
  }

  this.setState(prev => {
    const current = prev.tagsList || []
    // якщо тег уже є – нічого не робимо
    if (current.indexOf(newTag) !== -1) {
      return null
    }
    const next = []
    for (let i = 0; i < current.length; i++) {
      next[i] = current[i]
    }
    next[next.length] = newTag
    return { tagsList: next }
  })
}

/* Rename tag everywhere: in tagsList and in all examples */
handleRenameTag = (oldTag, newTag) => {
  if (!oldTag || !newTag) {
    return
  }

  this.setState(prev => {
    const currentList = prev.tagsList || []
    const newList = []
    for (let i = 0; i < currentList.length; i++) {
      if (currentList[i] === oldTag) {
        newList[i] = newTag
      } else {
        newList[i] = currentList[i]
      }
    }

    const targets0 = (prev.data && prev.data.goal && prev.data.goal.targets)
      ? prev.data.goal.targets
      : []

    const newTargets = targets0.map(t => {
      const src = t.examples || []
      const dst = []
      for (let i = 0; i < src.length; i++) {
        const ex = src[i]
        const srcTags = ex.tags || []
        const dstTags = []
        for (let j = 0; j < srcTags.length; j++) {
          if (srcTags[j] === oldTag) {
            dstTags[dstTags.length] = newTag
          } else {
            dstTags[dstTags.length] = srcTags[j]
          }
        }
        dst[i] = { ...ex, tags: dstTags }
      }
      return { number: t.number, title: t.title, examples: dst }
    })

    return {
      tagsList: newList,
      data: { goal: { ...prev.data.goal, targets: newTargets } }
    }
  })
}

/* Delete tag everywhere: from tagsList and from all examples */
handleDeleteTag = (tagToDelete) => {
  if (!tagToDelete) {
    return
  }

  this.setState(prev => {
    const currentList = prev.tagsList || []
    const newList = []
    for (let i = 0; i < currentList.length; i++) {
      if (currentList[i] !== tagToDelete) {
        newList[newList.length] = currentList[i]
      }
    }

    const targets0 = (prev.data && prev.data.goal && prev.data.goal.targets)
      ? prev.data.goal.targets
      : []

    const newTargets = targets0.map(t => {
      const src = t.examples || []
      const dst = []
      for (let i = 0; i < src.length; i++) {
        const ex = src[i]
        const srcTags = ex.tags || []
        const dstTags = []
        for (let j = 0; j < srcTags.length; j++) {
          if (srcTags[j] !== tagToDelete) {
            dstTags[dstTags.length] = srcTags[j]
          }
        }
        dst[i] = { ...ex, tags: dstTags }
      }
      return { number: t.number, title: t.title, examples: dst }
    })

    return {
      tagsList: newList,
      data: { goal: { ...prev.data.goal, targets: newTargets } }
    }
  })
}

  
    render() {
  
  const {
    view, tagsList, targets, selectedExample,
    search, selectedTarget, favourite, minRating, tagFilter
  } = this.state

  // targets list for forms 
  const formTargets = (targets || []).filter(t => t !== "All Targets")

  // precompute filtered examples once
  const examplesList = this.getFilteredExamples()

  // --- modal pages (single-view screens) ---
  if (view === "add") {
    return (
      <ExampleForm
        onSave={this.handleAddExample}
        onCancel={this.showTable}
        tags={tagsList}
        targets={formTargets}
      />
    )
  }

  if (view === "edit") {
    return (
      <ExampleForm
        example={this.state.exampleToEdit}
        onSave={this.handleUpdateExample}
        onCancel={this.showTable}
        tags={tagsList}
        targets={formTargets}
      />
    )
  }

  if (view === "tags") {
    return (
      <div>
        <TagsManager
          tags={tagsList}
          onAddTag={this.handleAddTag}
          onRenameTag={this.handleRenameTag}
          onDeleteTag={this.handleDeleteTag}
        />
        {/* Derek-style input button */}
        <input type="button" value="Back to Table" onClick={this.showTable}/>
      </div>
    )
  }

  if (view === "confirm-delete") {
    return (
      <ConfirmDeleteModal
        show={true}
        onConfirm={this.handleConfirmDelete}
        onCancel={this.showTable}
      />
    )
  }

  // --- main table screen ---
  return (
    <div id="goal12App">
      {/* Top navigation + filters */}
      <NavigationBar
        onShowTable={this.showTable}
        onAddExample={this.showAddForm}
        onManageTags={this.showTagsManager}
        search={search}
        selectedTarget={selectedTarget}
        favourite={favourite}
        minRating={minRating}
        tagFilter={tagFilter}
        tagsList={tagsList}
        targets={targets}
        onSearchChange={this.handleSearchChange}
        onTargetsChange={this.handleTargetsChange}
        onFavouriteChange={this.handleFavouriteChange}
        onMinRatingChange={this.handleMinRatingChange}
        onTagFilterChange={this.handleTagFilterChange}
      />

      {/* Table view (you can swap to Cards if needed) */}
  {/* Responsive: Table on desktop, Cards on mobile */}
<div className="d-none d-md-block">
  <ExamplesTable
    examples={examplesList}
    onSelectExample={(ex) => this.setState({ selectedExample: ex })}
    onEdit={this.showEditForm}
    onDelete={this.showDeleteConfirm}
  />
</div>

<div className="d-block d-md-none">
  <ExamplesCards
    examples={examplesList}
    onSelectExample={(ex) => this.setState({ selectedExample: ex })}
    onEdit={this.showEditForm}
    onDelete={this.showDeleteConfirm}
  />
</div>


      {/* Details modal */}
      {selectedExample &&
        <Modal
          example={selectedExample}
          onClose={() => this.setState({ selectedExample: null })}
        />
      }
    </div>
  )
}
}