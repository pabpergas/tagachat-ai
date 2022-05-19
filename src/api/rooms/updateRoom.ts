import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { ObjectId } from 'mongodb'

async function updateRoom(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { sessionId, roomId } = req.query
    if (!sessionId) throw new Error('no session id was provided')
    if (!roomId) throw new Error('no room id was provided')

    if (Array.isArray(sessionId)) sessionId = sessionId.join('')
    if (Array.isArray(roomId)) roomId = roomId.join('')

    const client = await clientPromise
    const db = client.db()

    await db.collection('rooms').updateOne(
      {
        _id: new ObjectId(roomId),
        sessionId: new ObjectId(sessionId),
      },
      {
        $set: req.body,
      }
    )

    return res.status(200).json({
      message: 'Room updated',
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: getErrorMessage(error),
      success: false,
    })
  }
}

export default updateRoom
