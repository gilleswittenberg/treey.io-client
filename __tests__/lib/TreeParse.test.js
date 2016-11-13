import TreeParse, { defaultNodeUI } from '../../app/lib/TreeParse'

describe('TreeParse', () => {

  const uid = '57bedc40e81b0620300d7690'
  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'
  const uid4 = '57bedc40e81b0620300d7694'

  describe('parse', () => {

    const nodeUi = defaultNodeUI

    it('root', () => {
      const tree = { uid, title: 'Mr. Foo' }
      expect(TreeParse.parse(tree)).toEqual({
        uid,
        path: [uid],
        data: { title: 'Mr. Foo' },
        nodeUi
      })
    })

    it('1st generation', () => {
      const nodes = [{ uid: uid1, title: 'First child' }, { uid: uid2, title: 'Second child' }]
      const tree = { uid, title: 'Mr. Foo', nodes }
      expect(TreeParse.parse(tree).nodes).toEqual([
        { uid: uid1, path: [uid, uid1], data: { title: 'First child' }, nodeUi },
        { uid: uid2, path: [uid, uid2], data: { title: 'Second child' }, nodeUi }
      ])
    })

    it('2nd generation', () => {
      const nodes = [{ uid: uid2, title: 'First grandchild' }, { uid: uid3, title: 'Second grandchild' }]
      const tree = {
        uid,
        title: 'Mr. Foo',
        nodes : [
          { uid: uid4, title: 'First child' },
          { uid: uid1, title: 'Second child', nodes }
        ]
      }
      expect(TreeParse.parse(tree).nodes[1].nodes).toEqual([
        { uid: uid2, path: [uid, uid1, uid2], data: { title: 'First grandchild' }, nodeUi },
        { uid: uid3, path: [uid, uid1, uid3], data: { title: 'Second grandchild' }, nodeUi }
      ])
    })

    it('ui', () => {
      const nodes = [{ uid: uid1, title: 'First child' }, { uid: uid2, title: 'Second child' }]
      const tree = { uid, title: 'Mr. Foo', nodes }
      const parsedTree = TreeParse.parse(tree)

      expect(parsedTree.nodeUi).toEqual(nodeUi)
      expect(parsedTree.nodes[1].nodeUi).toEqual(nodeUi)
    })
  })
})
