import Polygon from 'polygon'
import Vec2 from 'vec2'

export function hintTest(polygon, point) {
	return (new Polygon(polygon.poly)).containsPoint(Vec2(point[0], point[1]))
}

export function findIndex(polygons, point) {
	let reverseIndex = polygons.slice().reverse().findIndex(
		polygon => hintTest(polygon, point)
	)
	return reverseIndex < 0 ? -1 : (polygons.length - reverseIndex - 1)
}

