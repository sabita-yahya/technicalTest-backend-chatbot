import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Conversation from 'App/Models/Conversation'
import Message from 'App/Models/Message'
import axios from 'axios'

export default class ChatbotController {
  // FITUR 1: Kirim Pertanyaan (POST /questions)
  public async sendQuestion({ request, response }: HttpContextContract) {
    // 1. Ambil input
    const messageInput = request.input('message')
    const sessionIdInput = request.input('session_id') // Opsional dari user

    if (!messageInput) {
      return response.badRequest({ message: 'Pertanyaan wajib diisi!' })
    }

    // 2. Buat atau Cari Conversation (Berdasarkan Session ID)
    // Jika user tidak kirim session_id, kita buatkan random baru
    const finalSessionId = sessionIdInput || 'session-' + Math.floor(Math.random() * 1000000)

    const conversation = await Conversation.firstOrCreate(
      { sessionId: finalSessionId },
      { sessionId: finalSessionId }
    )

    // 3. Simpan Pesan USER ke Database
    await Message.create({
      conversationId: conversation.id,
      senderType: 'user',
      content: messageInput,
    })

    let botReply = 'Maaf, bot sedang gangguan.'

    // 4. Hubungi API Eksternal
    try {
      const externalApiUrl =
        'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message'

      const apiResponse = await axios.post(externalApiUrl, {
        message: messageInput,
        // API eksternal mungkin butuh session_id juga
        session_id: finalSessionId,
      })

      // Mengambil jawaban dari API eksternal (sesuai dokumentasi soal)
      // Biasanya ada di data.data atau data.message
      if (apiResponse.data && apiResponse.data.data) {
        botReply = apiResponse.data.data
      }
    } catch (error) {
      console.log('Error API Eksternal:', error.message)
      botReply = 'Gagal menghubungi server chatbot pemerintah.'
    }

    // 5. Simpan Pesan BOT ke Database
    await Message.create({
      conversationId: conversation.id,
      senderType: 'bot',
      content: botReply,
    })

    // Update last message di conversation
    conversation.lastMessage = messageInput
    await conversation.save()

    // 6. Response JSON ke User
    return response.json({
      status: 'success',
      session_id: finalSessionId,
      data: {
        question: messageInput,
        answer: botReply,
      },
    })
  }

  // FITUR 2: Lihat Semua Chat (GET /conversation)
  public async index({ response }: HttpContextContract) {
    const conversations = await Conversation.query().orderBy('updated_at', 'desc')
    return response.json(conversations)
  }

  // FITUR 3: Lihat Detail Chat (GET /conversation/:id)
  public async show({ params, response }: HttpContextContract) {
    // Cari conversation berdasarkan ID database atau Session ID
    const conversation = await Conversation.query()
      .where('id', params.id)
      .orWhere('session_id', params.id)
      .preload('messages') // Ambil sekalian pesan-pesannya
      .first()

    if (!conversation) {
      return response.notFound({ message: 'Percakapan tidak ditemukan' })
    }

    return response.json(conversation)
  }
}
