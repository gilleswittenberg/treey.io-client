/* @flow */

// @LINK: http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript#answer-10316616

export default function (a1: any[], a2: any[]) : bool {
  return JSON.stringify(a1) === JSON.stringify(a2)
}
