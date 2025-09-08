<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class GeneralNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $message;
    public $action_url;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $message, string $action_url = '/')
    {
        $this->message = $message;
        $this->action_url = $action_url;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast']; // Stocker ET diffuser en temps réel
    }

    /**
     * Get the array representation of the notification for the database.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'action_url' => $this->action_url,
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id, // Laravel ajoute l'ID automatiquement
            'read_at' => null,
            'data' => [
                 'message' => $this->message,
                 'action_url' => $this->action_url,
            ]
        ]);
    }
}
