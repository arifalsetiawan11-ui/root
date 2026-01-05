using FluentValidation;
using FeatureService.Api.DTOs;

namespace FeatureService.Api.Validators;

public class CreateReactionRequestValidator : AbstractValidator<CreateReactionRequest>
{
    private static readonly string[] ValidReactionTypes = { "like", "love", "fire", "sad", "laugh" };

    public CreateReactionRequestValidator()
    {
        RuleFor(x => x.ReactionType)
            .NotEmpty().WithMessage("Reaction type is required")
            .Must(type => ValidReactionTypes.Contains(type.ToLower()))
            .WithMessage("Reaction type must be one of: like, love, fire, sad, laugh");
    }
}
