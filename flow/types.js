/* @flow */

import { Map, List } from 'immutable'

export type Node = { uid: string, title: ?string, nodes: ?Node[] }
export type NodeMap = Map<string, any>
export type NodesList = List<NodeMap>
