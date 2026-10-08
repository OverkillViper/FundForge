<?php

use App\Support\Money;

test('money arithmetic and comparison operate at cent precision', function () {
    expect(Money::add('10.10', '2.35'))->toBe('12.45')
        ->and(Money::subtract('10.00', '12.35'))->toBe('-2.35')
        ->and(Money::compare('10.01', '10.00'))->toBe(1)
        ->and(Money::compare('10.00', '10.009'))->toBe(0)
        ->and(Money::compare('9.99', '10.00'))->toBe(-1);
});