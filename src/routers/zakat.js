const express = require('express');
const Calculator = require('../models/zakat'); // Adjust the path according to your project structure
const auth = require('../middleware/auth'); // Adjust the path according to your project structure
const { calculateZakat } = require('../utils/zakat-calculator/zakat-calculator');
const router = new express.Router();

// To calculate Zakat
router.post('/calculateZakat', async (req, res) =>
{
    try
    {
        // Calculate Zakat using the imported function
        const zakatValue = await calculateZakat(
            req.body.savingsLocation,
            req.body.locationForGold,
            req.body.locationForSilver,
            req.body.purity,
            req.body.weightOfGold,
            req.body.weightOfSilver,
            req.body.savings
        );

        // Display the result in the terminal
        // console.log(`Zakat for user ${req.user.name}: ${zakatValue}`);

        // Send a response back to the user
        res.send({ zakatValue });
    } catch (error)
    {
        console.error('Error calculating Zakat:', error);
        res.status(500).send();
    }
});

// To save Zakat amount
router.post('/saveZakatAmount', auth, async (req, res) =>
{
    const calculator = new Calculator
        (
            {
                zakatAmount: req.body.zakatAmount,
                userId: req.user._id
            }
        );

    try
    {
        await calculator.save();
        res.status(201).send({ zakatAmount: calculator.zakatAmount });
    } catch (error)
    {
        res.status(400).send(error);
    }
});

// Get saved Zakat values for the authenticated user
router.get('/savedzakatvalues', auth, async (req, res) =>
{
    try
    {
        // Find Zakat values saved by the authenticated user
        const zakatValues = await Calculator.find({ userId: req.user._id });

        // If no Zakat values found, send a 404 response
        if (!zakatValues)
        {
            return res.status(404).send({ error: 'No Zakat values found for this user.' });
        }

        // Send the found Zakat values
        res.send(zakatValues);
    } catch (error)
    {
        console.error('Error fetching saved Zakat values:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Delete a specific Zakat value record
router.delete('/deletezakatvalue/:id', auth, async (req, res) =>
{
    try
    {
        // Find the Zakat value by ID and user ID, then delete it
        const zakatValue = await Calculator.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        // If no Zakat value found, send a 404 response
        if (!zakatValue)
        {
            return res.status(404).send({ error: 'Zakat value not found.' });
        }

        // Send a success message
        res.send({ message: 'Zakat value deleted successfully.' });
    } catch (error)
    {
        console.error('Error deleting Zakat value:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



module.exports = router;
