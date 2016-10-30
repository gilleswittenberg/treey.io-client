/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NodeWrap from '../components/NodeWrap'
import NodeAdd from '../components/NodeAdd'
import { isEditing } from '../reducers/ui'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export class Nodes extends Component {

  static propTypes = {
    parent: PropTypes.string,
    nodes: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    isRoot: PropTypes.bool.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG,
    nodes: [],
    ui: {}
  }

  render () {

    const {
      lang,
      parent,
      isRoot,
      nodes,
      ui,
      actions,
      actions: { setIsEditing, unsetIsEditing, expand, postNode }
    } = this.props
    const hasNodeAdd = !isRoot
    const isAdding = isEditing(ui, parent, 'add')

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              parent={ parent }
              uid={ node.uid }
              after={ nodes[index + 1] ? nodes[index + 1].uid : null }
              title={ node.title }
              nodes={ node.nodes }
              actions={ actions }
            />
          </li>
        ) }

        { hasNodeAdd &&
          <li>
            <NodeAdd
              lang={ lang }
              parent={ parent }
              isEditing={ isAdding }
              setIsEditing={ setIsEditing }
              unsetIsEditing={ unsetIsEditing }
              expand={ expand }
              postNode={ postNode }
            />
          </li>
        }

      </ul>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state,
  lang: state.ui ? state.ui.lang : undefined,
  ...props,
  isRoot: props.parent === null
})
export default connect(mapStateToProps)(Nodes)
