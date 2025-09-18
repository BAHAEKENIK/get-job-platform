<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Broadcasting\PrivateChannel;

class GeneralNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $message;
    public $action_url;

    // On va stocker l'ID de l'utilisateur pour y avoir accès plus tard
    private $userId;

    public function __construct(string $message, string $action_url = '/')
    {
        $this->message = $message;
        $this->action_url = $action_url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param object $notifiable
     * @return array
     */
    public function via(object $notifiable): array
    {
        // On récupère l'ID de l'utilisateur ici
        $this->userId = $notifiable->id;

        return ['database', 'broadcast'];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array
     */
    public function broadcastOn(): array
    {
        // On utilise la propriété que nous avons sauvegardée
        return [new PrivateChannel('App.Models.User.' . $this->userId)];
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
            'id' => $this->id,
            'read_at' => null,
            'created_at' => now()->toIso8601String(),
            'data' => [
                 'message' => $this->message,
                 'action_url' => $this->action_url,
            ]
        ]);
    }
}
