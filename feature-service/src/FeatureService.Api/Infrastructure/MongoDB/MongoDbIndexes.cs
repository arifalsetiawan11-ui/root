using MongoDB.Driver;
using FeatureService.Api.Models.Entities;

namespace FeatureService.Api.Infrastructure.MongoDB;

public static class MongoDbIndexes
{
    public static async Task CreateIndexesAsync(MongoDbContext dbContext)
    {
        // Replies indexes
        var repliesCollection = dbContext.GetCollection<Reply>("replies");
        var replyIndexKeys = Builders<Reply>.IndexKeys
            .Ascending(r => r.ThreadId)
            .Descending(r => r.CreatedAt);
        var replyIndexModel = new CreateIndexModel<Reply>(replyIndexKeys);
        await repliesCollection.Indexes.CreateOneAsync(replyIndexModel);

        // Reactions unique index
        var reactionsCollection = dbContext.GetCollection<Reaction>("reactions");
        var reactionIndexKeys = Builders<Reaction>.IndexKeys
            .Ascending(r => r.UserId)
            .Ascending(r => r.TargetType)
            .Ascending(r => r.TargetId);
        var reactionIndexOptions = new CreateIndexOptions { Unique = true };
        var reactionIndexModel = new CreateIndexModel<Reaction>(reactionIndexKeys, reactionIndexOptions);
        await reactionsCollection.Indexes.CreateOneAsync(reactionIndexModel);

        // Target index for reactions (to query by target)
        var targetIndexKeys = Builders<Reaction>.IndexKeys
            .Ascending(r => r.TargetType)
            .Ascending(r => r.TargetId);
        var targetIndexModel = new CreateIndexModel<Reaction>(targetIndexKeys);
        await reactionsCollection.Indexes.CreateOneAsync(targetIndexModel);
    }
}
