// @flow

import { Map, List } from 'immutable'

export type Node = { uid: string, nodes: Node[] }
export type NodeMap = Map<any, any>
export type NodesList = List<NodeMap>
